import { z } from "zod";

export const LoginBodySchema = z.object({
	token: z.string(),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const LoginReturnSchema = z.object({
	id: z.number(),
	company_id: z.number(),
	email: z.string(),
});

export const LoginUnauthorizedSchema = z.object({
	code: z.enum(["SCR4M_unauthorized"]),
});

export const LoginBadRequestSchema = z.object({
	code: z.enum(["SCR4M_no_user"]),
});
