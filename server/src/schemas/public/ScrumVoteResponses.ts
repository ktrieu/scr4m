import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { ScrumVotesId } from "./ScrumVotes.js";
import type { UsersId } from "./Users.js";

/** Identifier type for public.scrum_vote_responses */
export type ScrumVoteResponsesId = number & { __brand: "ScrumVoteResponsesId" };

/** Represents the table public.scrum_vote_responses */
export default interface ScrumVoteResponsesTable {
	id: ColumnType<ScrumVoteResponsesId, never, never>;

	available: ColumnType<boolean, boolean, boolean>;

	user_id: ColumnType<UsersId, UsersId, UsersId>;

	vote_id: ColumnType<ScrumVotesId, ScrumVotesId, ScrumVotesId>;

	created_at: ColumnType<Date, Date | string, Date | string>;
}

export type ScrumVoteResponses = Selectable<ScrumVoteResponsesTable>;

export type NewScrumVoteResponses = Insertable<ScrumVoteResponsesTable>;

export type ScrumVoteResponsesUpdate = Updateable<ScrumVoteResponsesTable>;
