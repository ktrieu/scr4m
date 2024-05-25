import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
    Kysely,
    Migrator,
    PostgresDialect,
    FileMigrationProvider,
} from 'kysely'
import { ENV_CONFIG } from './env'

// This is in JS so we can migrate in production without needing a TS compiler.

async function migrateToLatest() {
    const db = new Kysely<unknown>({
        dialect: new PostgresDialect({
            pool: new Pool({
                host: ENV_CONFIG.DATABASE_HOST,
                user: ENV_CONFIG.DATABASE_USER,
                password: ENV_CONFIG.DATABASE_PASSWORD,
                database: ENV_CONFIG.DATABASE_NAME,
                port: ENV_CONFIG.DATABASE_PORT,
            }),
        }),
    })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            // This needs to be an absolute path.
            migrationFolder: path.join(__dirname, '/migrations'),
        }),
    })

    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

migrateToLatest()