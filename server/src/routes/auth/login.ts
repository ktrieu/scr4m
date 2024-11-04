import {
	LoginBadRequestSchema,
	LoginBodySchema,
	LoginInternalServerErrorSchema,
	LoginReturn,
	LoginReturnSchema,
	LoginUnauthorizedSchema,
} from "@scr4m/common";
import { verifyGoogleToken } from "../../auth/index.js";
import { getUserByGoogleSubject } from "../../db/user/index.js";
import type { FastifyApp } from "../../index.js";
import { getCompanyById } from "../../db/company/index.js";

export const registerLoginRoute = (fastify: FastifyApp) => {
	fastify.post(
		"/auth/login",
		{
			schema: {
				body: LoginBodySchema,
				response: {
					200: LoginReturnSchema,
					400: LoginBadRequestSchema,
					401: LoginUnauthorizedSchema,
					500: LoginInternalServerErrorSchema,
				},
			},
		},
		async (request, reply): Promise<LoginReturn> => {
			const token = await verifyGoogleToken(request, request.body.token);
			if (token === null) {
				return reply.code(401).send({ code: "SCR4M_unauthorized" });
			}

			const payload = token.getPayload();
			if (payload === undefined) {
				return reply.code(401).send({ code: "SCR4M_unauthorized" });
			}

			const user = await getUserByGoogleSubject(request.server.db, payload.sub);
			if (user === null) {
				return reply.code(400).send({ code: "SCR4M_no_user" });
			}

			request.session.user_id = user.id;

			const company = await getCompanyById(fastify.db, user.company_id);
			if (!company) {
				return reply.code(500).send({ code: "SCR4M_company_not_found" })
			}

			return {
				user,
				company: {
					name: company.name,
				}
			}
		},
	);
};
