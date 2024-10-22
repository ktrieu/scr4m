import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.createTable("scrums")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity(),
		)
		.addColumn("created_at", "timestamptz", (col) => col.notNull())
		.addColumn("scrum_number", "integer", (col) => col.notNull())
		.addColumn("title", "text", (col) => col.notNull())
		.addColumn("company_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrums_companies_foreign_key",
			["company_id"],
			"companies",
			["id"],
		)
		.execute();

	await db.schema
		.createIndex("scrums_company_id_scrum_number_idx")
		.unique()
		.on("scrums")
		.columns(["company_id", "scrum_number"])
		.execute();

	await db.schema
		.createTable("scrum_members")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity(),
		)
		.addColumn("name", "text", (col) => col.notNull())
		.addColumn("user_id", "integer")
		.addForeignKeyConstraint(
			"scrum_members_users_foreign_key",
			["user_id"],
			"users",
			["id"],
		)
		.addColumn("company_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrum_members_companies_foreign_key",
			["company_id"],
			"companies",
			["id"],
		)
		.execute();

	await db.schema
		.createIndex("scrum_members_company_id_idx")
		.on("scrum_members")
		.column("company_id")
		.execute();

	await db.schema
		.createType("scrum_entry_type")
		.asEnum(["todo", "did", "done"])
		.execute();

	await db.schema
		.createTable("scrum_entries")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity(),
		)
		.addColumn("body", "text", (col) => col.notNull())
		.addColumn("order", "integer", (col) => col.notNull())
		.addColumn("type", sql`scrum_entry_type`, (col) => col.notNull())
		.addColumn("member_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrum_entries_members_foreign_key",
			["member_id"],
			"scrum_members",
			["id"],
		)
		.addColumn("company_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrum_entries_companies_foreign_key",
			["company_id"],
			"companies",
			["id"],
		)
		.addUniqueConstraint("scrum_entries_unique", [
			"company_id",
			"member_id",
			"order",
		])
		.execute();

	await db.schema
		.createIndex("scrum_entries_company_id_idx")
		.on("scrum_entries")
		.column("company_id")
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropIndex("scrum_entries_company_id_idx").execute();
	await db.schema.dropType("scrum_entry_type").execute();
	await db.schema.dropTable("scrum_entries").execute();
	await db.schema.dropIndex("scrum_members_company_id_idx").execute();
	await db.schema.dropTable("scrum_members").execute();
	await db.schema.dropIndex("scrums_company_id_scrum_number_idx").execute();
	await db.schema.dropTable("scrums").execute();
}
