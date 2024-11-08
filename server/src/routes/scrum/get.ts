import {
	type ScrumGetMember,
	ScrumGetParamsSchema,
	type ScrumGetResponse,
	ScrumGetResponseSchema,
} from "@scr4m/common";
import { getUserFromSession } from "../../auth/session.js";
import {
	getAttendanceForScrum,
	getMembersForCompany,
	getOrderedEntriesForScrum,
	getScrumByNumber,
} from "../../db/scrum/index.js";
import type { FastifyApp } from "../../index.js";

export const registerScrumGetRoute = (fastify: FastifyApp) => {
	fastify.get(
		"/scrums/:number",
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

			const scrum = await getScrumByNumber(
				fastify.db,
				request.params.number,
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
					present: false,
				};
			}

			const entries = await getOrderedEntriesForScrum(fastify.db, scrum.id);
			for (const e of entries) {
				const member = membersMap[e.member_id];

				switch (e.type) {
					case "did":
						member.dids.push({
							id: e.id,
							order: e.order,
							body: e.body,
						});
						break;
					case "todo":
						member.todos.push({
							id: e.id,
							order: e.order,
							body: e.body,
						});
						break;
					case "todid":
						// TODO: Todids are just last scrum's todos, I don't even know why I included them as a database type.
						break;
				}
			}

			const attendances = await getAttendanceForScrum(fastify.db, scrum.id);
			for (const a of attendances) {
				const member = membersMap[a.scrum_member_id];
				member.present = true;
			}

			const memberList = Array.from(Object.values(membersMap));

			console.log(memberList);

			return {
				id: scrum.id,
				title: scrum.title,
				number: scrum.scrum_number,
				members: memberList,
			};
		},
	);
};
