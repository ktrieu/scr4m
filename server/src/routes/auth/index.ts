import type { FastifyApp } from "../../index.js";
import { registerLoginRoute } from "./login.js";
import { registerMeRoute } from "./me.js";
import { registerRegisterRoute } from "./register.js";

export const registerAuthRoutes = (fastify: FastifyApp) => {
	registerRegisterRoute(fastify);
	registerLoginRoute(fastify);
	registerMeRoute(fastify);
};
