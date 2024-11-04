import { z } from "zod";
import { MeReturnSchema } from "./me.js";

export const LoginBodySchema = z.object({
	token: z.string(),
});

export type LoginBody = z.infer<typeof LoginBodySchema>;

export const LoginReturnSchema = MeReturnSchema;

export type LoginReturn = z.infer<typeof LoginReturnSchema>;

export const LoginUnauthorizedSchema = z.object({
	code: z.enum(["SCR4M_unauthorized"]),
});

export const LoginBadRequestSchema = z.object({
	code: z.enum(["SCR4M_no_user"]),
});

export const LoginInternalServerErrorSchema = z.object({
	code: z.enum(["SCR4M_company_not_found"]),
});
