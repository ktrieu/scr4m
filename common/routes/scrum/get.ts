import { z } from "zod";

const ScrumGetEntrySchema = z.object({
	id: z.number().int().nonnegative(),
	body: z.string(),
	order: z.number().int().nonnegative(),
});

export type ScrumGetEntry = z.infer<typeof ScrumGetEntrySchema>;

const ScrumGetMemberSchema = z.object({
	id: z.number().int().nonnegative(),
	name: z.string(),
	todos: z.array(ScrumGetEntrySchema),
	dids: z.array(ScrumGetEntrySchema),
	present: z.boolean(),
});

export type ScrumGetMember = z.infer<typeof ScrumGetMemberSchema>;

export const ScrumGetResponseSchema = z.object({
	title: z.string(),
	id: z.number().int().nonnegative(),
	number: z.number().positive(),
	members: z.array(ScrumGetMemberSchema),
});

export type ScrumGetResponse = z.infer<typeof ScrumGetResponseSchema>;

export const ScrumGetParamsSchema = z.object({
	number: z.coerce.number().int().positive(),
});
