import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema.alterTable("users").addColumn("discord_id", "text").execute();
	await db.schema
		.createIndex("users_discord_id_idx")
		.on("users")
		.column("discord_id")
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.dropIndex("users_discord_id_idx").execute();
	await db.schema.alterTable("users").dropColumn("discord_id").execute();
}
