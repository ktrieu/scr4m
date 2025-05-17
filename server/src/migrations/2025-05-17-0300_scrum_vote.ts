import type { Kysely } from "kysely";
import { sql } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.createType("scrum_vote_status")
		.asEnum(["open", "possible", "impossible"])
		.execute();

	await db.schema
		.createTable("scrum_votes")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity(),
		)
		.addColumn("status", sql`scrum_vote_status`, (col) => col.notNull())
		.addColumn("scrum_date", "date", (col) => col.notNull())
		.addColumn("message_id", "text", (col) => col.notNull())
		.execute();

	await db.schema
		.createIndex("scrum_votes_message_id_idx")
		.on("scrum_votes")
		.column("message_id")
		.execute();

	await db.schema
		.createTable("scrum_vote_responses")
		.addColumn("id", "integer", (col) =>
			col.primaryKey().generatedAlwaysAsIdentity(),
		)
		.addColumn("available", "boolean", (col) => col.notNull())
		.addColumn("user_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrum_vote_responses_users_foreign_key",
			["user_id"],
			"users",
			["id"],
		)
		.addColumn("vote_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"scrum_vote_responses_scrum_votes_foreign_key",
			["vote_id"],
			"scrum_votes",
			["id"],
		)
		.addColumn("created_at", "timestamptz", (col) => col.notNull())
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropTable("scrum_vote_responses").execute();
	await db.schema.dropIndex("scrum_votes_message_id_idx").execute();
	await db.schema.dropTable("scrum_votes").execute();
	await db.schema.dropType("scrum_vote_status").execute();
}
