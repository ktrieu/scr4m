import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable("scrum_entries")
		.dropConstraint("scrum_entries_unique")
		.execute();

	await db.schema
		.alterTable("scrum_entries")
		.addUniqueConstraint("scrum_entries_unique", [
			"scrum_id",
			"member_id",
			"type",
			"order",
		])
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema
		.alterTable("scrum_entries")
		.dropConstraint("scrum_entries_unique")
		.execute();

	await db.schema
		.alterTable("scrum_entries")
		.addUniqueConstraint("scrum_entries_unique", [
			"scrum_id",
			"member_id",
			"order",
		])
		.execute();
}
