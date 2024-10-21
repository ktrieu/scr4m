import type { Session } from "fastify";
import type { SessionsId } from "../../schemas/public/Sessions.js";
import type { UsersId } from "../../schemas/public/Users.js";
import type { DbInstance } from "../index.js";

export const getSessionById = async (
	db: DbInstance,
	id: string,
	expiresBefore: Date,
) => {
	return db
		.selectFrom("sessions")
		.selectAll()
		.where("id", "=", <SessionsId>id)
		.where("expiry", ">", expiresBefore)
		.executeTakeFirst();
};

export const createOrUpdateSession = async (
	db: DbInstance,
	id: string,
	expiry: Date,
	session: Session,
) => {
	return db
		.insertInto("sessions")
		.values({
			id: <SessionsId>id,
			expiry,
			user_id: <UsersId>session.user_id,
			cookie: session.cookie,
		})
		.onConflict((oc) =>
			oc.column("id").doUpdateSet({
				expiry,
				user_id: <UsersId>session.user_id,
				cookie: session.cookie,
			}),
		)
		.execute();
};

export const deleteSession = async (db: DbInstance, id: string) => {
	return db
		.deleteFrom("sessions")
		.where("id", "=", <SessionsId>id)
		.execute();
};
