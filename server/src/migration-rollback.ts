import { promises as fs } from "node:fs";
import * as path from "node:path";
import { FileMigrationProvider, Kysely, Migrator } from "kysely";
import { createPostgresDialect } from "./db/index.js";

async function migrationRollback() {
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

	const { error, results } = await migrator.migrateDown();

	for (const it of results ?? []) {
		if (it.status === "Success") {
			console.log(
				`migration "${it.migrationName}" was rolled back successfully`,
			);
		} else if (it.status === "Error") {
			console.error(`failed to rollback migration "${it.migrationName}"`);
		}
	}

	if (error) {
		console.error("failed to rollback");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
}

migrationRollback();
