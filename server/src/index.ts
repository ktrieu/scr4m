import { fastifyCookie } from "@fastify/cookie";
import { fastifySession } from "@fastify/session";
import Fastify from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { getSessionRegisterOptions } from "./auth/session.js";
import { ENV_CONFIG } from "./env.js";
import { kyselyPlugin } from "./kysely-plugin.js";
import { registerAuthRoutes } from "./routes/auth/index.js";

const fastify = Fastify({
	logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const app = fastify
	.withTypeProvider<ZodTypeProvider>()
	.register(kyselyPlugin)
	.register(fastifyCookie)
	.register(fastifySession, getSessionRegisterOptions());

export type FastifyApp = typeof app;

registerAuthRoutes(app);

fastify.listen({ port: ENV_CONFIG.PORT, host: "0.0.0.0" });
