import {
	type ScrumGetMember,
	ScrumGetParamsSchema,
	type ScrumGetResponse,
	ScrumGetResponseSchema,
} from "@scr4m/common";
import type { FastifyApp } from "../../index.js";
import { getUserFromSession } from "../../auth/session.js";
import {
	getMembersForCompany,
	getOrderedEntriesForScrum,
	getScrumById,
} from "../../db/scrum/index.js";
import type { ScrumsId } from "../../schemas/public/Scrums.js";

export const registerScrumGetRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/scrums/:id",
		{
			schema: {
				params: ScrumGetParamsSchema,
				response: {
					200: ScrumGetResponseSchema,
				},
			},
		},
		async (request, reply): Promise<ScrumGetResponse> => {
			const user = await getUserFromSession(fastify.db, request.session);
			if (!user) {
				return reply.status(401).send();
			}

			const scrum = await getScrumById(
				fastify.db,
				<ScrumsId>request.params.id,
				user.company_id,
			);
			if (!scrum) {
				return reply.status(404).send();
			}

			const members = await getMembersForCompany(fastify.db, user.company_id);
			const membersMap: Record<string, ScrumGetMember> = {};

			for (const m of members) {
				membersMap[m.id] = {
					id: m.id,
					name: m.name,
					dids: [],
					todos: [],
				};
			}

			const entries = await getOrderedEntriesForScrum(fastify.db, scrum.id);

			for (const e of entries) {
				const member = membersMap[e.member_id];

				switch (e.type) {
					case "did":
						member.dids.push(e.body);
						break;
					case "todo":
						member.todos.push(e.body);
						break;
					case "todid":
						// TODO: Todids are just last scrum's todos, I don't even know why I included them as a database type.
						break;
				}
			}

			const memberList = Array.from(Object.values(membersMap));

			return {
				id: scrum.id,
				title: scrum.title,
				number: scrum.scrum_number,
				members: memberList,
			};
		},
	);
};
