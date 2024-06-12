import { z } from 'zod'

export const RegisterBodySchema = z.object({
    token: z.string(),
})

export type RegisterBody = z.infer<typeof RegisterBodySchema>;

export const RegisterPathSchema = z.object({
    company_id: z.coerce.number(),
})

export const RegisterReturnSchema = z.object({
    id: z.number(),
    company_id: z.number(),
    email: z.string(),
})

export const RegisterBadRequestSchema = z.object({
    code: z.enum(["SCR4M_existing_user"]),
})

export const RegisterUnauthorizedSchema = z.object({
    code: z.enum(['SCR4M_unauthorized']),
})