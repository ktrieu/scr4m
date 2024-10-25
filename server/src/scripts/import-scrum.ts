import { z } from "zod";

import { exit } from "node:process";
import { json } from "node:stream/consumers";
import { Kysely } from "kysely";
import { type DbInstance, createPostgresDialect } from "../db/index.js";
import type Database from "../schemas/Database.js";
import type { CompaniesId } from "../schemas/public/Companies.js";
import type ScrumEntryType from "../schemas/public/ScrumEntryType.js";
import type { ScrumMembersId } from "../schemas/public/ScrumMembers.js";
import type { ScrumsId } from "../schemas/public/Scrums.js";

const MEMBER_SCHEMA = z.object({
	id: z.number().positive(),
	todids: z.array(z.string()),
	dids: z.array(z.string()),
	todos: z.array(z.string()),
});

const SCRUM_SCHEMA = z.object({
	name: z.string(),
	number: z.number().positive(),
	createdAt: z.string().datetime(),
	members: z.array(MEMBER_SCHEMA),
	companyId: z.number(),
});

const rowFromEntry = (
	body: string,
	memberId: ScrumMembersId,
	scrumId: ScrumsId,
	type: ScrumEntryType,
	order: number,
) => {
	return {
		member_id: memberId,
		scrum_id: scrumId,
		type,
		body,
		order,
	};
};

const main = async () => {
	const stdinJson = await json(process.stdin);
	const { success, error, data: scrum } = SCRUM_SCHEMA.safeParse(stdinJson);
	if (!success) {
		console.error("Invalid JSON format.");
		console.error(error.format());
		exit(1);
	}

	const db: DbInstance = new Kysely<Database>({
		dialect: createPostgresDialect(),
	});

	// Validate company/member IDs:
	const company = await db
		.selectFrom("companies")
		.select("id")
		.where("id", "=", <CompaniesId>scrum.companyId)
		.executeTakeFirst();
	if (company === undefined) {
		console.error(`Company ${scrum.companyId} not found.`);
		exit(1);
	}

	for (const m of scrum.members) {
		const member = await db
			.selectFrom("scrum_members")
			.select("id")
			.where("company_id", "=", <CompaniesId>scrum.companyId)
			.where("id", "=", <ScrumMembersId>m.id)
			.executeTakeFirst();

		if (member === undefined) {
			console.error(`Member ${m.id} not found`);
			exit(1);
		}
	}

	db.transaction().execute(async (tx) => {
		const { id: scrumId } = await tx
			.insertInto("scrums")
			.values({
				company_id: <CompaniesId>scrum.companyId,
				created_at: scrum.createdAt,
				scrum_number: scrum.number,
				title: scrum.name,
			})
			.returning("id")
			.executeTakeFirstOrThrow();

		const entries: Array<ReturnType<typeof rowFromEntry>> = [];

		for (const m of scrum.members) {
			m.todos.forEach((body, i) => {
				entries.push(
					rowFromEntry(body, <ScrumMembersId>m.id, scrumId, "todo", i),
				);
			});
			m.dids.forEach((body, i) => {
				entries.push(
					rowFromEntry(body, <ScrumMembersId>m.id, scrumId, "did", i),
				);
			});
			m.todids.forEach((body, i) => {
				entries.push(
					rowFromEntry(body, <ScrumMembersId>m.id, scrumId, "todid", i),
				);
			});
		}

		await tx.insertInto("scrum_entries").values(entries).execute();
	});
};

await main();
