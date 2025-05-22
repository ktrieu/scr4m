import type { Kysely } from "kysely";
import { sendScrumMessage, type DiscordBot } from "../discord/index.js";
import type PublicSchema from "../schemas/public/PublicSchema.js";
import { DateTime } from "luxon";
import {
	closeScrumVote,
	createScrumVote,
	isScrumVoteOpen,
} from "../db/scrum-vote/index.js";
import type { CompaniesId } from "../schemas/public/Companies.js";

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

const openScrum = async (
	notifier: ScrumNotifier,
	companyId: CompaniesId,
	now: DateTime,
) => {
	const message = await sendScrumMessage(notifier.bot);

	await createScrumVote(notifier.db, companyId, now, message.id);
};

const closeScrum = async (
	notifier: ScrumNotifier,
	companyId: CompaniesId,
	now: DateTime,
) => {
	// Calculate the actual status later.
	await closeScrumVote(notifier.db, companyId, now, "possible");
};

// The greatest time zone, of course.
const NOTIFIER_TZ = "America/Toronto";

// Half-open intervals for when a scrum should be opened or closed.
// 24-hour in Eastern time.
const SCRUM_OPEN_INTERVAL = [0, 16] as const;
const SCRUM_CLOSE_INTERVAL = [16, 24] as const;

const nowInInterval = (
	now: DateTime,
	interval: readonly [number, number],
): boolean => {
	const eastern = now.setZone(NOTIFIER_TZ);

	return eastern.hour >= interval[0] && eastern.hour < interval[1];
};

const scrumNotifierRoutine = async (notifier: ScrumNotifier) => {
	const now = DateTime.now();
	const todayScrumOpen = await isScrumVoteOpen(notifier.db, COMPANY_ID, now);

	if (!todayScrumOpen && nowInInterval(now, SCRUM_OPEN_INTERVAL)) {
		await openScrum(notifier, COMPANY_ID, now);
	}

	if (todayScrumOpen && nowInInterval(now, SCRUM_CLOSE_INTERVAL)) {
		await closeScrum(notifier, COMPANY_ID, now);
	}
};

// Run this notifier routine once every minute.
const SCRUM_NOTIFIER_INTERVAL_MSECS = 60 * 1000;

export const startScrumNotifierRoutine = (notifier: ScrumNotifier) => {
	setInterval(async () => {
		scrumNotifierRoutine(notifier);
	}, SCRUM_NOTIFIER_INTERVAL_MSECS);
};
