import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable("scrum_entries")
		.dropColumn("company_id")
		.addColumn("scrum_id", "integer", (col) => col.notNull())
		.execute();

	await db.schema
		.alterTable("scrum_entries")
		.addForeignKeyConstraint(
			"scrum_entry_scrum_foreign_key",
			["scrum_id"],
			"scrums",
			["id"],
		)
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

export async function down(db: Kysely<any>) {
	await db.schema
		.alterTable("scrum_entries")
		.dropColumn("scrum_id")
		.addColumn("company_id", "integer", (col) => col.notNull())
		.execute();

	await db.schema
		.alterTable("scrum_entries")
		.addForeignKeyConstraint(
			"scrum_entries_companies_foreign_key",
			["company_id"],
			"companies",
			["id"],
		)
		.execute();

	await db.schema
		.alterTable("scrum_entries")
		.addUniqueConstraint("scrum_entries_unique", [
			"company_id",
			"member_id",
			"order",
		])
		.execute();
}
