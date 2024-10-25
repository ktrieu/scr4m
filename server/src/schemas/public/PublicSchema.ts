import type CompaniesTable from "./Companies.js";
import type KyselyMigrationTable from "./KyselyMigration.js";
import type KyselyMigrationLockTable from "./KyselyMigrationLock.js";
import type ScrumEntriesTable from "./ScrumEntries.js";
import type ScrumMembersTable from "./ScrumMembers.js";
import type ScrumsTable from "./Scrums.js";
import type SessionsTable from "./Sessions.js";
import type UsersTable from "./Users.js";

export default interface PublicSchema {
	kysely_migration: KyselyMigrationTable;

	kysely_migration_lock: KyselyMigrationLockTable;

	companies: CompaniesTable;

	users: UsersTable;

	sessions: SessionsTable;

	scrums: ScrumsTable;

	scrum_members: ScrumMembersTable;

	scrum_entries: ScrumEntriesTable;
}
