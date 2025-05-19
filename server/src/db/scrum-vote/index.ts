import type { Kysely } from "kysely";
import { DateTime } from "luxon";
import type { CompaniesId } from "../../schemas/public/Companies.js";
import type PublicSchema from "../../schemas/public/PublicSchema.js";
import type ScrumVoteStatus from "../../schemas/public/ScrumVoteStatus.js";
import type {
	NewScrumVotes,
	ScrumVotes,
} from "../../schemas/public/ScrumVotes.js";

// For now, consider this to be our canonical timezone.
const SCRUM_VOTE_TZ = "America/Toronto";

// Transforms an arbitrary DateTime into our preferred timezone and
// truncates to a date with no time component.
const dateToScrumDate = (date: DateTime): DateTime => {
	const easternDt = date.setZone(SCRUM_VOTE_TZ);

	return DateTime.fromObject({
		year: easternDt.year,
		month: easternDt.month,
		day: easternDt.day,
	});
};

export const createScrumVote = async (
	db: Kysely<PublicSchema>,
	company: CompaniesId,
	date: DateTime,
	discordMessageId: string,
): Promise<ScrumVotes> => {
	const scrumDate = dateToScrumDate(date);

	const scrumVote: NewScrumVotes = {
		company_id: company,
		scrum_date: scrumDate.toJSDate(),
		message_id: discordMessageId,
		status: "open",
	};

	return db
		.insertInto("scrum_votes")
		.values(scrumVote)
		.returningAll()
		.executeTakeFirstOrThrow();
};

export const closeScrumVote = async (
	db: Kysely<PublicSchema>,
	companyId: CompaniesId,
	date: DateTime,
	status: ScrumVoteStatus,
) => {
	const scrumDate = dateToScrumDate(date);

	return db
		.updateTable("scrum_votes")
		.where("scrum_votes.company_id", "=", companyId)
		.where("scrum_date", "=", scrumDate.toJSDate())
		.set("status", status)
		.execute();
};
