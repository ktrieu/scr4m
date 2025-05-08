import { getCompanyById } from "../../db/company/index.js";
import type { FastifyApp } from "../../index.js";

import {
	PublicCompaniesGetResponseSchema,
	PublicCompaniesGetParamsSchema,
	type PublicCompaniesGetResponse,
} from "@scr4m/common";
import type { CompaniesId } from "../../schemas/public/Companies.js";

export const registerPublicCompaniesGetRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/public/companies/:id",
		{
			schema: {
				response: {
					200: PublicCompaniesGetResponseSchema,
				},
				params: PublicCompaniesGetParamsSchema,
			},
		},
		async (request, reply): Promise<PublicCompaniesGetResponse> => {
			const company = await getCompanyById(
				fastify.db,
				<CompaniesId>request.params.id,
			);

			if (!company) {
				return reply.status(404).send();
			}

			return {
				id: company?.id,
				name: company.name,
			};
		},
	);
};
