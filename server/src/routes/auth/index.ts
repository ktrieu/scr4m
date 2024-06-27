import { registerRegisterRoute } from "./register.js";
import type { FastifyApp } from "../../index.js";
import { registerLoginRoute } from "./login.js";

export const registerAuthRoutes = (fastify: FastifyApp) => {
	registerRegisterRoute(fastify);
	registerLoginRoute(fastify);
};
