import type { DateTime } from "luxon";
import type { ScrumVotesId } from "../../schemas/public/ScrumVotes.js";
import type { UsersId } from "../../schemas/public/Users.js";
import type { ScrumVoteResponses } from "../../schemas/public/ScrumVoteResponses.js";
import type { Kysely } from "kysely";
import type PublicSchema from "../../schemas/public/PublicSchema.js";

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
