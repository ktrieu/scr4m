import { z } from "zod";

import { json } from "node:stream/consumers";
import { createPostgresDialect } from "../db/index.js";

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

const main = async () => {
	const stdinJson = await json(process.stdin);
	console.log("json:", stdinJson);
	const result = SCRUM_SCHEMA.safeParse(stdinJson);
	if (!result.success) {
		console.error("Invalid JSON format.");
		console.error(result.error.format());
	}

	const db = createPostgresDialect();
};

await main();
