import { type Kysely, sql } from "kysely";

export async function up(db: Kysely<any>) {
	await sql`alter type scrum_entry_type rename value 'done' to 'todid'`.execute(
		db,
	);
}

export async function down(db: Kysely<any>) {
	await sql`alter type scrum_entry_type rename value 'todid' to 'done'`.execute(
		db,
	);
}
