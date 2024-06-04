import { Kysely, SchemaModule } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema.createTable('companies')
        .addColumn("id", "integer", (col) => col.primaryKey().generatedAlwaysAsIdentity())
        .execute();


    await db.schema.createTable("users")
        .addColumn("id", "integer", (col) => col.primaryKey().generatedAlwaysAsIdentity())
        .addColumn("email", 'text', (col) => col.notNull())
        .addColumn("google_sub", "text", (col) => col.notNull())
        .addColumn("approved_at", "timestamptz")
        .addColumn("company_id", "integer", (col) => col.notNull())
        .addForeignKeyConstraint("users_companies_foreign_key", ["company_id"], "companies", ["id"])
        .execute();

    await db.schema.createIndex("user_google_sub_index")
        .unique()
        .on("users")
        .column("google_sub")
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropIndex("user_google_sub_index").execute();
    await db.schema.dropTable("users").execute();

    await db.schema.dropTable("companies").execute();
}