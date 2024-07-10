import fp from "fastify-plugin";

import type { FastifyPluginCallback } from "fastify";
import type { Kysely } from "kysely";
import type Database from "./schemas/Database.js";

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
