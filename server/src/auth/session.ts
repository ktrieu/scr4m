import type { FastifySessionOptions, SessionStore } from "@fastify/session";
import { ENV_CONFIG } from "../env.js";
import type { Kysely } from "kysely";
import type Database from "../schemas/Database.js";

declare module "fastify" {
	interface Session {
		user_id: number;
	}
}

const createSessionStore = (db: Kysely<Database>): SessionStore => {
	// Bunch of no-op stuff for now.
	return {
		get: (sessionId, callback) => {},
		set: (sessionId, session, callback) => {},
		destroy: (sessionId, callback) => {},
	};
};

export const createSessionRegisterOptions = (
	db: Kysely<Database>,
): FastifySessionOptions => {
	return {
		secret: ENV_CONFIG.SESSION_SECRET,
		store: createSessionStore(db),
	};
};
