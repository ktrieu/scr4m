import type { CompaniesId } from "../../schemas/public/Companies.js";
import type { Scrums } from "../../schemas/public/Scrums.js";
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
		.orderBy("created_at desc");

	if (before) {
		query = query.where("created_at", "<", new Date(before));
	}

	if (after) {
		query = query.where("created_at", ">", new Date(after));
	}

	return query.execute();
};
