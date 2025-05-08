import type { FastifyApp } from "../../index.js";
import { registerPublicCompaniesGetRoute } from "./get.js";

export const registerPublicCompaniesRoutes = (fastify: FastifyApp) => {
	registerPublicCompaniesGetRoute(fastify);
};
