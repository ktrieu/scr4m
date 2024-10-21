import { z } from "zod";
import { UserSchema } from "../user.js";

export const LoginBodySchema = z.object({
	token: z.string(),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const LoginReturnSchema = UserSchema;

export const LoginUnauthorizedSchema = z.object({
	code: z.enum(["SCR4M_unauthorized"]),
});

export const LoginBadRequestSchema = z.object({
	code: z.enum(["SCR4M_no_user"]),
});
