import { z } from "zod";

export const ScrumListObject = z.object({
	title: z.string(),
	number: z.number().positive(),
	createdAt: z.string().datetime(),
});

export const ScrumListReturnSchema = z.object({
	scrums: z.array(ScrumListObject),
});

export type ScrumListReturn = z.infer<typeof ScrumListReturnSchema>;

export const ScrumQuerySchema = z.object({
	before: z.coerce.number().optional(),
	after: z.coerce.number().optional(),
});
