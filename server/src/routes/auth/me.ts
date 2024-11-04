import { MeInternalServerErrorSchema, MeReturn, MeReturnSchema, MeUnauthorizedSchema } from "@scr4m/common";
import { getUserFromSession } from "../../auth/session.js";
import type { FastifyApp } from "../../index.js";
import { getCompanyById } from "../../db/company/index.js";

export const registerMeRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/auth/me",
		{
			schema: {
				response: {
					200: MeReturnSchema,
					401: MeUnauthorizedSchema,
					500: MeInternalServerErrorSchema,
				},
			},
		},
		async (request, reply): Promise<MeReturn> => {
			const user = await getUserFromSession(fastify.db, request.session);

			if (!user) {
				return reply.code(401).send({});
			}

			const company = await getCompanyById(fastify.db, user.company_id);
			if (!company) {
				return reply.code(500).send({ code: 'SCR4M_company_not_found'})
			}

			return {
				user: {
					id: user.id,
					email: user.email,
					company_id: user.company_id,
				},
				company: {
					name: company?.name
				}
			}
		},
	);
};
