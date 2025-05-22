import type { Kysely } from "kysely";
import { sendScrumMessage, type DiscordBot } from "../discord/index.js";
import type PublicSchema from "../schemas/public/PublicSchema.js";
import { DateTime } from "luxon";
import { createScrumVote, isScrumVoteOpen } from "../db/scrum-vote/index.js";
import type { CompaniesId } from "../schemas/public/Companies.js";
import { scheduleJob } from "node-schedule";

type ScrumNotifier = {
	db: Kysely<PublicSchema>;
	bot: DiscordBot;
};

export const createScrumNotifier = (
	db: Kysely<PublicSchema>,
	bot: DiscordBot,
) => {
	return {
		db,
		bot,
	};
};

const COMPANY_ID = <CompaniesId>1;

const openScrumJob = async (notifier: ScrumNotifier) => {
	const now = DateTime.now();

	const voteAlreadyOpen = await isScrumVoteOpen(notifier.db, COMPANY_ID, now);
	if (voteAlreadyOpen) {
		throw new Error(`Scrum vote already open for company ${COMPANY_ID}`);
	}

	const message = await sendScrumMessage(notifier.bot);

	await createScrumVote(notifier.db, COMPANY_ID, now, message.id);
};

export const scheduleScrumNotifyJobs = (notifier: ScrumNotifier) => {
	scheduleJob("0 7 * * *", async () => {
		await openScrumJob(notifier);
	});
};
