import { readFileSync } from "fs"
import { Kysely, PostgresDialect } from "kysely"
import pg from "pg"
import { ENV_CONFIG } from "../env.js"
import PublicSchema from "../schemas/public/PublicSchema.js"

export const createPostgresDialect = () => {
    return new PostgresDialect({
        pool: new pg.Pool({
            host: ENV_CONFIG.DATABASE_HOST,
            user: ENV_CONFIG.DATABASE_USER,
            password: ENV_CONFIG.DATABASE_PASSWORD,
            database: ENV_CONFIG.DATABASE_NAME,
            ssl: ENV_CONFIG.DATABASE_USE_SSL ? { ca: readFileSync("do-db-cert.crt").toString() } : false,
            port: ENV_CONFIG.DATABASE_PORT,
        }),
    })
}

export type DbInstance = Kysely<PublicSchema>;