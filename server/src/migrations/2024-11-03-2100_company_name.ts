import type { Kysely } from "kysely";

export async function up(db: Kysely<any>) {
	await db.schema
		.alterTable("companies")
		.addColumn("name", "text", (col) => col.notNull().defaultTo(""))
		.execute();
}

export async function down(db: Kysely<any>) {
	await db.schema.alterTable("companies").dropColumn("name").execute();
}
