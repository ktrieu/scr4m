import type { Companies, CompaniesId } from "../../schemas/public/Companies.js";
import type { DbInstance } from "../index.js";

export const getCompanyById = async (
	db: DbInstance,
	id: CompaniesId,
): Promise<Companies | undefined> => {
	return db
		.selectFrom("companies")
		.selectAll()
		.where("id", "=", id)
		.executeTakeFirst();
};
