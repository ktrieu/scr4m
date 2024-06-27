import {
	LoginBadRequestSchema,
	LoginBodySchema,
	LoginReturnSchema,
	LoginUnauthorizedSchema,
} from "@scr4m/common";
import { FastifyApp } from "../../index.js";
import { verifyGoogleToken } from "../../auth/index.js";
import { getUserByGoogleSubject } from "../../db/user/index.js";

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

			const user = await getUserByGoogleSubject(request.server.db, payload.sub);
			if (user === null) {
				return reply.code(400).send({ code: "SCR4M_no_user" });
			}

			return user;
		},
	);
};
