import type { ColumnType, Insertable, Selectable, Updateable } from "kysely";

/** Identifier type for public.companies */
export type CompaniesId = number & { __brand: "CompaniesId" };

/** Represents the table public.companies */
export default interface CompaniesTable {
	id: ColumnType<CompaniesId, never, never>;

	name: ColumnType<string, string, string>;
}

export type Companies = Selectable<CompaniesTable>;

export type NewCompanies = Insertable<CompaniesTable>;

export type CompaniesUpdate = Updateable<CompaniesTable>;
