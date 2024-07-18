import { MeReturnSchema } from "@scr4m/common";
import type { FastifyApp } from "../../index.js";
import { getUserFromSession } from "../../auth/session.js";

export const registerMeRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/auth/me",
		{
			schema: {
				response: {
					200: MeReturnSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await getUserFromSession(fastify.db, request.session);

			if (!user) {
				return reply.code(401).send();
			}

			return {
				id: user.id,
				email: user.email,
				company_id: user.company_id,
			};
		},
	);
};
