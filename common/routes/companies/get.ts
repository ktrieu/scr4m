import { z } from "zod";

export const PublicCompaniesGetParamsSchema = z.object({
	id: z.coerce.number().int().nonnegative(),
});

export type PublicCompaniesGetParams = z.infer<
	typeof PublicCompaniesGetParamsSchema
>;

export const PublicCompaniesGetResponseSchema = z.object({
	id: z.coerce.number().int().nonnegative(),
	name: z.string(),
});

export type PublicCompaniesGetResponse = z.infer<
	typeof PublicCompaniesGetResponseSchema
>;
