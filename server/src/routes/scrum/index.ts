import type { FastifyApp } from "../../index.js";
import { registerScrumGetRoute } from "./get.js";
import { registerScrumListRoute } from "./list.js";

export const registerScrumRoutes = (fastify: FastifyApp) => {
	registerScrumListRoute(fastify);
	registerScrumGetRoute(fastify);
};
