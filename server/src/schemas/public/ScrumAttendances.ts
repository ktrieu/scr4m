import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { ScrumMembersId } from "./ScrumMembers.js";
import type { ScrumsId } from "./Scrums.js";

/** Identifier type for public.scrum_attendances */
export type ScrumAttendancesId = number & { __brand: "ScrumAttendancesId" };

/** Represents the table public.scrum_attendances */
export default interface ScrumAttendancesTable {
	id: ColumnType<ScrumAttendancesId, never, never>;

	scrum_member_id: ColumnType<ScrumMembersId, ScrumMembersId, ScrumMembersId>;

	scrum_id: ColumnType<ScrumsId, ScrumsId, ScrumsId>;
}

export type ScrumAttendances = Selectable<ScrumAttendancesTable>;

export type NewScrumAttendances = Insertable<ScrumAttendancesTable>;

export type ScrumAttendancesUpdate = Updateable<ScrumAttendancesTable>;
