import { z } from "zod";
import { UserSchema } from "../user.js";

export const MeReturnSchema = z.object({
	user: UserSchema,
	company: z.object({
		name: z.string(),
	}),
});

export type MeReturn = z.infer<typeof MeReturnSchema>;

export const MeUnauthorizedSchema = z.object({});

export const MeInternalServerErrorSchema = z.object({
	code: z.enum(["SCR4M_company_not_found"]),
});
