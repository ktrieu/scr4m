import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { UsersId } from "./Users.js";

/** Identifier type for public.sessions */
export type SessionsId = string & { __brand: "SessionsId" };

/** Represents the table public.sessions */
export default interface SessionsTable {
	id: ColumnType<SessionsId, SessionsId, SessionsId>;

	user_id: ColumnType<UsersId, UsersId, UsersId>;

	expiry: ColumnType<Date, Date | string, Date | string>;
}

export type Sessions = Selectable<SessionsTable>;

export type NewSessions = Insertable<SessionsTable>;

export type SessionsUpdate = Updateable<SessionsTable>;
