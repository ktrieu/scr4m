import fp from "fastify-plugin";
import { Kysely } from "kysely";

import type { FastifyPluginCallback } from "fastify";
import { createPostgresDialect } from "./db/index.js";
import type Database from "./schemas/Database.js";

declare module "fastify" {
	interface FastifyInstance {
		db: Kysely<Database>;
	}
}

const pluginCallback: FastifyPluginCallback = (fastify, opts, done) => {
	const dialect = createPostgresDialect();

	const db = new Kysely<Database>({ dialect });
	fastify.decorate("db", db);

	done();
};

export const kyselyPlugin = fp(pluginCallback);
