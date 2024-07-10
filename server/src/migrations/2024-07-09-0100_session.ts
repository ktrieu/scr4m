import type { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("sessions")
		.addColumn("id", "text", (col) => col.notNull().primaryKey())
		.addColumn("user_id", "integer", (col) => col.notNull())
		.addColumn("cookie", "jsonb", (col) => col.notNull())
		.addColumn("expiry", "timestamptz", (col) => col.notNull())
		.addForeignKeyConstraint(
			"sessions_users_foreign_key",
			["user_id"],
			"users",
			["id"],
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("sessions").execute();
}
