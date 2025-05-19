import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { CompaniesId } from "./Companies.js";
import type ScrumVoteStatus from "./ScrumVoteStatus.js";

/** Identifier type for public.scrum_votes */
export type ScrumVotesId = number & { __brand: "ScrumVotesId" };

/** Represents the table public.scrum_votes */
export default interface ScrumVotesTable {
	id: ColumnType<ScrumVotesId, never, never>;

	company_id: ColumnType<CompaniesId, CompaniesId, CompaniesId>;

	status: ColumnType<ScrumVoteStatus, ScrumVoteStatus, ScrumVoteStatus>;

	scrum_date: ColumnType<Date, Date | string, Date | string>;

	message_id: ColumnType<string, string, string>;
}

export type ScrumVotes = Selectable<ScrumVotesTable>;

export type NewScrumVotes = Insertable<ScrumVotesTable>;

export type ScrumVotesUpdate = Updateable<ScrumVotesTable>;
