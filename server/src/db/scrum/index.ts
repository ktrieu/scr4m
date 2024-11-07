import type { CompaniesId } from "../../schemas/public/Companies.js";
import type { ScrumAttendances } from "../../schemas/public/ScrumAttendances.js";
import type { ScrumEntries } from "../../schemas/public/ScrumEntries.js";
import type { ScrumMembers } from "../../schemas/public/ScrumMembers.js";
import type { Scrums, ScrumsId } from "../../schemas/public/Scrums.js";
import type { DbInstance } from "../index.js";

export const getScrumsForCompany = async (
	db: DbInstance,
	companyId: CompaniesId,
	before?: number,
	after?: number,
): Promise<Array<Scrums>> => {
	let query = db
		.selectFrom("scrums")
		.selectAll()
		.where("company_id", "=", companyId)
		.orderBy("submitted_at desc");

	if (before) {
		query = query.where("submitted_at", "<", new Date(before));
	}

	if (after) {
		query = query.where("submitted_at", ">", new Date(after));
	}

	return query.execute();
};

export const getScrumByNumber = async (
	db: DbInstance,
	scrumNumber: number,
	companyId: CompaniesId,
): Promise<Scrums | undefined> => {
	return db
		.selectFrom("scrums")
		.selectAll()
		.where("scrum_number", "=", scrumNumber)
		.where("company_id", "=", companyId)
		.executeTakeFirst();
};

export const getOrderedEntriesForScrum = async (
	db: DbInstance,
	scrumId: ScrumsId,
): Promise<Array<ScrumEntries>> => {
	return db
		.selectFrom("scrum_entries")
		.selectAll()
		.where("scrum_id", "=", scrumId)
		.orderBy("member_id")
		.orderBy("order asc")
		.execute();
};

export const getAttendanceForScrum = async (
	db: DbInstance,
	scrumId: ScrumsId,
): Promise<Array<ScrumAttendances>> => {
	return db
		.selectFrom("scrum_attendances")
		.selectAll()
		.where("scrum_id", "=", scrumId)
		.execute();
};

export const getMembersForCompany = async (
	db: DbInstance,
	companyId: CompaniesId,
): Promise<Array<ScrumMembers>> => {
	return db
		.selectFrom("scrum_members")
		.selectAll()
		.where("company_id", "=", companyId)
		.execute();
};
