import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type ScrumEntryType from "./ScrumEntryType.js";
import type { ScrumMembersId } from "./ScrumMembers.js";
import type { ScrumsId } from "./Scrums.js";

/** Identifier type for public.scrum_entries */
export type ScrumEntriesId = number & { __brand: "ScrumEntriesId" };

/** Represents the table public.scrum_entries */
export default interface ScrumEntriesTable {
	id: ColumnType<ScrumEntriesId, never, never>;

	body: ColumnType<string, string, string>;

	order: ColumnType<number, number, number>;

	type: ColumnType<ScrumEntryType, ScrumEntryType, ScrumEntryType>;

	member_id: ColumnType<ScrumMembersId, ScrumMembersId, ScrumMembersId>;

	scrum_id: ColumnType<ScrumsId, ScrumsId, ScrumsId>;
}

export type ScrumEntries = Selectable<ScrumEntriesTable>;

export type NewScrumEntries = Insertable<ScrumEntriesTable>;

export type ScrumEntriesUpdate = Updateable<ScrumEntriesTable>;
