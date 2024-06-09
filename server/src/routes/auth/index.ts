import { registerRegisterRoute } from "./register.js";
import { FastifyApp } from "../../index.js";

export const registerAuthRoutes = (fastify: FastifyApp) => {
    registerRegisterRoute(fastify);
}