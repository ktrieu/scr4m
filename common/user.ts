import { z } from "zod";

export const UserSchema = z.object({
	id: z.number(),
	company_id: z.number(),
	email: z.string(),
});

export type User = z.infer<typeof UserSchema>;
