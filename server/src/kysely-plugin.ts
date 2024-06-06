import fp from "fastify-plugin";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { ENV_CONFIG } from "./env.js";
import { readFileSync } from "fs";

import type Database from "./schemas/Database.js";
import { FastifyPluginCallback } from "fastify";
import { createPostgresDialect } from "./db/index.js";

declare module 'fastify' {
    interface FastifyInstance {
        db: Kysely<Database>
    }
}

const pluginCallback: FastifyPluginCallback = (fastify, opts, done) => {
    const dialect = createPostgresDialect();

    const db = new Kysely<Database>({ dialect });
    fastify.decorate('db', db);

    done();
};

export const kyselyPlugin = fp(pluginCallback);