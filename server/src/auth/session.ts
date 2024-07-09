import type { FastifySessionOptions, SessionStore } from "@fastify/session";
import { ENV_CONFIG } from "../env.js";

declare module "fastify" {
	interface Session {
		user_id: number;
	}
}

const createSessionStore = (): SessionStore => {
	// Bunch of no-op stuff for now.
	return {
		get: (sessionId, callback) => {},
		set: (sessionId, session, callback) => {},
		destroy: (sessionId, callback) => {},
	};
};

export const getSessionRegisterOptions = (): FastifySessionOptions => {
	return {
		secret: ENV_CONFIG.SESSION_SECRET,
		store: createSessionStore(),
	};
};
