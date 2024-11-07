import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable("scrums")
		.renameColumn("created_at", "submitted_at")
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema
		.alterTable("scrums")
		.renameColumn("submitted_at", "created_at")
		.execute();
}
