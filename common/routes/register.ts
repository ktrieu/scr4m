import { z } from 'zod'

export const RegisterBodySchema = z.object({
    token: z.string(),
})

export type RegisterBody = z.infer<typeof RegisterBodySchema>;