import { type Kysely, sql } from "kysely";
import type { DateTime } from "luxon";
import type PublicSchema from "../../schemas/public/PublicSchema.js";
import type { ScrumVoteResponses } from "../../schemas/public/ScrumVoteResponses.js";
import type { ScrumVotesId } from "../../schemas/public/ScrumVotes.js";
import type { UsersId } from "../../schemas/public/Users.js";
import type { DbInstance } from "../index.js";

export const createScrumVoteResponse = async (
	db: Kysely<PublicSchema>,
	voteId: ScrumVotesId,
	available: boolean,
	user: UsersId,
	time: DateTime,
): Promise<ScrumVoteResponses> => {
	return db
		.insertInto("scrum_vote_responses")
		.values({
			available,
			user_id: user,
			created_at: time.toJSDate(),
			vote_id: voteId,
		})
		.returningAll()
		.executeTakeFirstOrThrow();
};

type CollectedVoteResponses = Record<UsersId, boolean>;

export const getLatestResponsesForVote = async (
	db: DbInstance,
	voteId: ScrumVotesId,
): Promise<CollectedVoteResponses> => {
	const votes = await sql<ScrumVoteResponses>`
		SELECT * FROM (
			SELECT
				svr.*, 
				ROW_NUMBER() OVER (
					PARTITION BY user_id, vote_id ORDER BY created_at DESC
				) AS rank 
				FROM 
					public.scrum_vote_responses svr 
				WHERE svr.vote_id = ${voteId}
		) WHERE rank = 1
	`.execute(db);

	const resps: CollectedVoteResponses = {};

	for (const v of votes.rows) {
		resps[v.user_id] = v.available;
	}

	return resps;
};
