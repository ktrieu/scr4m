import type { CompaniesId } from './Companies.js';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.users */
export type UsersId = number & { __brand: 'UsersId' };

/** Represents the table public.users */
export default interface UsersTable {
  id: ColumnType<UsersId, never, never>;

  email: ColumnType<string, string, string>;

  google_sub: ColumnType<string, string, string>;

  approved_at: ColumnType<Date | null, Date | string | null, Date | string | null>;

  company_id: ColumnType<CompaniesId, CompaniesId, CompaniesId>;
}

export type Users = Selectable<UsersTable>;

export type NewUsers = Insertable<UsersTable>;

export type UsersUpdate = Updateable<UsersTable>;