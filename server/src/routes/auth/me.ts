import { MeReturnSchema, MeUnauthorizedSchema } from "@scr4m/common";
import { getUserFromSession } from "../../auth/session.js";
import type { FastifyApp } from "../../index.js";

export const registerMeRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/auth/me",
		{
			schema: {
				response: {
					200: MeReturnSchema,
					401: MeUnauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await getUserFromSession(fastify.db, request.session);

			if (!user) {
				return reply.code(401).send({});
			}

			return {
				id: user.id,
				email: user.email,
				company_id: user.company_id,
			};
		},
	);
};
