import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { CompaniesId } from "./Companies.js";
import type { UsersId } from "./Users.js";

/** Identifier type for public.scrum_members */
export type ScrumMembersId = number & { __brand: "ScrumMembersId" };

/** Represents the table public.scrum_members */
export default interface ScrumMembersTable {
	id: ColumnType<ScrumMembersId, never, never>;

	name: ColumnType<string, string, string>;

	user_id: ColumnType<UsersId | null, UsersId | null, UsersId | null>;

	company_id: ColumnType<CompaniesId, CompaniesId, CompaniesId>;
}

export type ScrumMembers = Selectable<ScrumMembersTable>;

export type NewScrumMembers = Insertable<ScrumMembersTable>;

export type ScrumMembersUpdate = Updateable<ScrumMembersTable>;
