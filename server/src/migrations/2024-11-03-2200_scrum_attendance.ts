import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("scrum_attendances")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity(),
		)
		.addColumn("scrum_member_id", "integer", (col) => col.notNull())
		.addColumn("scrum_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrum_attendances_scrum_members_foreign_key",
			["scrum_member_id"],
			"scrum_members",
			["id"],
		)
		.addForeignKeyConstraint(
			"scrum_attendances_scrums_foreign_key",
			["scrum_id"],
			"scrums",
			["id"],
		)
		.execute();

	await db.schema
		.createIndex("scrum_attendances_scrum_id_scrum_member_id_idx")
		.on("scrum_attendances")
		.columns(["scrum_id", "scrum_member_id"])
		.unique()
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema
		.dropIndex("scrum_attendances_scrum_id_scrum_member_id_idx")
		.execute();
	await db.schema.dropTable("scrum_attendances").execute();
}
