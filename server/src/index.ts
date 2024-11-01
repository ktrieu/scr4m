import { fastifyCookie } from "@fastify/cookie";
import { fastifySession } from "@fastify/session";
import Fastify from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { Kysely } from "kysely";
import { createSessionRegisterOptions } from "./auth/session.js";
import { createPostgresDialect } from "./db/index.js";
import { ENV_CONFIG } from "./env.js";
import { createKyselyPlugin } from "./kysely-plugin.js";
import { registerAuthRoutes } from "./routes/auth/index.js";
import { registerScrumRoutes } from "./routes/scrum/index.js";
import type Database from "./schemas/Database.js";

const fastify = Fastify({
	logger: true,
	trustProxy: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const dialect = createPostgresDialect();
const db = new Kysely<Database>({ dialect });

const app = fastify
	.withTypeProvider<ZodTypeProvider>()
	.register(createKyselyPlugin(db))
	.register(fastifyCookie)
	.register(fastifySession, createSessionRegisterOptions(db));

export type FastifyApp = typeof app;

registerAuthRoutes(app);
registerScrumRoutes(app);

fastify.listen({ port: ENV_CONFIG.PORT, host: "0.0.0.0" });
