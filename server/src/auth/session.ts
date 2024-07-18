import type { FastifySessionOptions, SessionStore } from "@fastify/session";
import type { Kysely } from "kysely";
import { ENV_CONFIG } from "../env.js";
import type Database from "../schemas/Database.js";
import type { Session } from "fastify";
import {
	createSession,
	deleteSession,
	getSessionById,
} from "../db/session/index.js";
import type { Users } from "../schemas/public/Users.js";
import { getUserById } from "../db/user/index.js";

declare module "fastify" {
	interface Session {
		user_id: number | undefined;
	}
}

// Seven days, in ms.
const SESSION_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7;

const asyncGetSession = async (
	db: Kysely<Database>,
	sessionId: string,
): Promise<Session | undefined> => {
	const session = await getSessionById(db, sessionId, new Date());

	if (session === undefined) {
		return undefined;
	}

	return {
		user_id: session.user_id,
		// biome-ignore lint/suspicious/noExplicitAny: We can assume that the type of the cookie JSON is correct since we only insert a valid session.
		cookie: <any>session.cookie,
	};
};

const asyncSetSession = async (
	db: Kysely<Database>,
	sessionId: string,
	session: Session,
) => {
	const expiry = Date.now() + SESSION_EXPIRY_MS;
	await createSession(db, sessionId, new Date(expiry), session);
};

const asyncDeleteSession = async (db: Kysely<Database>, sessionId: string) => {
	await deleteSession(db, sessionId);
};

const createSessionStore = (db: Kysely<Database>): SessionStore => {
	// Bunch of no-op stuff for now.
	return {
		get: (sessionId, callback) => {
			asyncGetSession(db, sessionId)
				.then((session) => {
					callback(null, session);
				})
				.catch((err) => {
					callback(err);
				});
		},
		set: (sessionId, session, callback) => {
			asyncSetSession(db, sessionId, session)
				.then(() => {
					callback(null);
				})
				.catch((err) => {
					callback(err);
				});
		},
		destroy: (sessionId, callback) => {
			asyncDeleteSession(db, sessionId)
				.then(() => {
					callback(null);
				})
				.catch((err) => {
					callback(err);
				});
		},
	};
};

export const createSessionRegisterOptions = (
	db: Kysely<Database>,
): FastifySessionOptions => {
	return {
		secret: ENV_CONFIG.SESSION_SECRET,
		store: createSessionStore(db),
		cookie: {
			secure: ENV_CONFIG.USE_SECURE_SESSION_COOKIE,
		},
		saveUninitialized: false,
	};
};

export const getUserFromSession = async (
	db: Kysely<Database>,
	session: Session,
): Promise<Users | null> => {
	if (session.user_id === undefined) {
		return null;
	}

	const user = await getUserById(db, session.user_id);
	return user ?? null;
};
