import { z } from "zod";

import { exit } from "node:process";
import { createInterface } from "node:readline";
import { Kysely, type Transaction } from "kysely";
import { type DbInstance, createPostgresDialect } from "../db/index.js";
import type Database from "../schemas/Database.js";
import type { CompaniesId } from "../schemas/public/Companies.js";
import type PublicSchema from "../schemas/public/PublicSchema.js";
import type ScrumEntryType from "../schemas/public/ScrumEntryType.js";
import type { ScrumMembersId } from "../schemas/public/ScrumMembers.js";
import type { ScrumsId } from "../schemas/public/Scrums.js";

const MEMBER_SCHEMA = z.object({
	id: z.number().positive(),
	dids: z.array(z.string()),
	todos: z.array(z.string()),
});

const SCRUM_SCHEMA = z.object({
	name: z.string(),
	number: z.number().positive(),
	createdAt: z.string().datetime({ offset: true }),
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

const insertScrumLine = async (line: string, tx: Transaction<PublicSchema>) => {
	const parsed = JSON.parse(line);
	const { success, error, data: scrum } = SCRUM_SCHEMA.safeParse(parsed);
	if (!success) {
		console.error("Invalid JSON format.");
		console.error(error.format());
		console.error(parsed);
		exit(1);
	}

	// Validate company/member IDs:
	const company = await tx
		.selectFrom("companies")
		.select("id")
		.where("id", "=", <CompaniesId>scrum.companyId)
		.executeTakeFirst();
	if (company === undefined) {
		console.error(`Company ${scrum.companyId} not found.`);
		exit(1);
	}

	for (const m of scrum.members) {
		const member = await tx
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
			entries.push(rowFromEntry(body, <ScrumMembersId>m.id, scrumId, "did", i));
		});
	}

	// Calling Kysely insert with zero-length array causes a crash.
	if (entries.length !== 0) {
		await tx.insertInto("scrum_entries").values(entries).execute();
	}
};

const main = async () => {
	const db: DbInstance = new Kysely<Database>({
		dialect: createPostgresDialect(),
	});

	await db.transaction().execute(async (tx) => {
		const rl = createInterface(process.stdin);
		for await (const l of rl) {
			await insertScrumLine(l, tx);
		}
	});
};

await main();
