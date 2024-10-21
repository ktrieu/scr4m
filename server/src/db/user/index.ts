import type { NewUsers, Users, UsersId } from "../../schemas/public/Users.js";
import type { DbInstance } from "../index.js";

export const getUserByGoogleSubject = async (
	db: DbInstance,
	sub: string,
): Promise<Users | null> => {
	const user = await db
		.selectFrom("users")
		.selectAll()
		.where("google_sub", "=", sub)
		.executeTakeFirst();

	return user ?? null;
};

export const createUser = async (
	db: DbInstance,
	fields: NewUsers,
): Promise<Users> => {
	return db
		.insertInto("users")
		.values(fields)
		.returningAll()
		.executeTakeFirstOrThrow();
};

export const getUserById = async (
	db: DbInstance,
	id: number,
): Promise<Users | null> => {
	const user = await db
		.selectFrom("users")
		.selectAll()
		.where("id", "=", <UsersId>id)
		.executeTakeFirst();

	return user ?? null;
};
