import { z } from "zod";

const ScrumGetMemberSchema = z.object({
	id: z.number().int().positive(),
	name: z.string(),
	todos: z.array(z.string()),
	dids: z.array(z.string()),
	present: z.boolean(),
});

export type ScrumGetMember = z.infer<typeof ScrumGetMemberSchema>;

export const ScrumGetResponseSchema = z.object({
	title: z.string(),
	id: z.number().int().positive(),
	number: z.number().positive(),
	members: z.array(ScrumGetMemberSchema),
});

export type ScrumGetResponse = z.infer<typeof ScrumGetResponseSchema>;

export const ScrumGetParamsSchema = z.object({
	number: z.coerce.number().int().positive(),
});
