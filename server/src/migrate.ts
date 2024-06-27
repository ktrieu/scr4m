import * as path from "path";
import { Pool } from "pg";
import { promises as fs, readFileSync } from "fs";
import {
	Kysely,
	Migrator,
	PostgresDialect,
	FileMigrationProvider,
} from "kysely";
import { createPostgresDialect } from "./db/index.js";

async function migrateToLatest() {
	const db = new Kysely<unknown>({
		dialect: createPostgresDialect(),
	});

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			// This needs to be an absolute path.
			migrationFolder: path.join(import.meta.dirname, "/migrations"),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

migrateToLatest();
