import { z } from "zod";

export const ScrumListObjectSchema = z.object({
	title: z.string(),
	number: z.number().positive(),
	createdAt: z.string().datetime(),
	id: z.number().positive(),
});

export const ScrumListReturnSchema = z.object({
	scrums: z.array(ScrumListObjectSchema),
});

export type ScrumListObject = z.infer<typeof ScrumListObjectSchema>;
export type ScrumListReturn = z.infer<typeof ScrumListReturnSchema>;

export const ScrumQuerySchema = z.object({
	before: z.coerce.number().optional(),
	after: z.coerce.number().optional(),
});
