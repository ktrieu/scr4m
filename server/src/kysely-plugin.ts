import fp from "fastify-plugin";

import type { FastifyPluginCallback } from "fastify";
import type Database from "./schemas/Database.js";
import type { Kysely } from "kysely";

declare module "fastify" {
	interface FastifyInstance {
		db: Kysely<Database>;
	}
}

const createPluginCallback = (db: Kysely<Database>): FastifyPluginCallback => {
	return (fastify, opts, done) => {
		fastify.decorate("db", db);

		done();
	};
};

export const createKyselyPlugin = (db: Kysely<Database>) =>
	fp(createPluginCallback(db));
