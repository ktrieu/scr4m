import {
	type ScrumListObject,
	type ScrumListReturn,
	ScrumListReturnSchema,
	ScrumQuerySchema,
} from "@scr4m/common";
import { z } from "zod";
import { getUserFromSession } from "../../auth/session.js";
import { getScrumsForCompany } from "../../db/scrum/index.js";
import type { FastifyApp } from "../../index.js";

export const registerScrumListRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/scrums",
		{
			schema: {
				querystring: ScrumQuerySchema,
				response: { 200: ScrumListReturnSchema, 401: z.object({}) },
			},
		},
		async (request, reply): Promise<ScrumListReturn> => {
			const user = await getUserFromSession(fastify.db, request.session);

			if (!user) {
				return reply.code(401).send({});
			}

			const { before, after } = request.query;

			const dbScrums = await getScrumsForCompany(
				fastify.db,
				user.company_id,
				before,
				after,
			);

			const apiScrums: Array<ScrumListObject> = dbScrums.map((s) => ({
				number: s.scrum_number,
				submittedAt: s.submitted_at.toISOString(),
				title: s.title,
				id: s.id,
			}));

			return {
				scrums: apiScrums,
			};
		},
	);
};
