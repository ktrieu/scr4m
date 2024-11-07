import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";
import type { CompaniesId } from "./Companies.js";

/** Identifier type for public.scrums */
export type ScrumsId = number & { __brand: "ScrumsId" };

/** Represents the table public.scrums */
export default interface ScrumsTable {
	id: ColumnType<ScrumsId, never, never>;

	submitted_at: ColumnType<Date, Date | string, Date | string>;

	scrum_number: ColumnType<number, number, number>;

	title: ColumnType<string, string, string>;

	company_id: ColumnType<CompaniesId, CompaniesId, CompaniesId>;
}

export type Scrums = Selectable<ScrumsTable>;

export type NewScrums = Insertable<ScrumsTable>;

export type ScrumsUpdate = Updateable<ScrumsTable>;
