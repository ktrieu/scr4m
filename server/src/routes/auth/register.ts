import {
	RegisterBadRequestSchema,
	RegisterBodySchema,
	RegisterPathSchema,
	RegisterReturnSchema,
	RegisterUnauthorizedSchema,
} from "@scr4m/common";
import { verifyGoogleToken } from "../../auth/index.js";
import { createUser, getUserByGoogleSubject } from "../../db/user/index.js";
import type { FastifyApp } from "../../index.js";
import type { CompaniesId } from "../../schemas/public/Companies.js";

export const registerRegisterRoute = (fastify: FastifyApp) => {
	fastify.post(
		"/auth/register/:company_id",
		{
			schema: {
				body: RegisterBodySchema,
				params: RegisterPathSchema,
				response: {
					200: RegisterReturnSchema,
					400: RegisterBadRequestSchema,
					401: RegisterUnauthorizedSchema,
				},
			},
		},
		async (request, reply) => {
			const token = await verifyGoogleToken(request, request.body.token);
			if (token === null) {
				return reply.code(401).send({ code: "SCR4M_unauthorized" });
			}

			const payload = token.getPayload();
			if (payload === undefined) {
				return reply.code(401).send({ code: "SCR4M_unauthorized" });
			}

			const existingUser = await getUserByGoogleSubject(
				request.server.db,
				payload.sub,
			);
			if (existingUser !== null) {
				// Oops, existing user already. Don't send a different error so we don't leak
				// user existence through the register endpoint.
				return reply.code(400).send({ code: "SCR4M_existing_user" });
			}

			const newUser = await createUser(request.server.db, {
				email: payload.email ?? "",
				company_id: request.params.company_id as CompaniesId,
				google_sub: payload.sub,
			});

			request.session.user_id = newUser.id;

			return reply.code(200).send(newUser);
		},
	);
};
