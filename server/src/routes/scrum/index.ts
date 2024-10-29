import type { FastifyApp } from "../../index.js";
import { registerScrumListRoute } from "./list.js";

export const registerScrumRoutes = (fastify: FastifyApp) => {
	registerScrumListRoute(fastify);
};
