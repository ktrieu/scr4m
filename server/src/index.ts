import Fastify from "fastify";
import {
	type ZodTypeProvider,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { ENV_CONFIG } from "./env.js";
import { kyselyPlugin } from "./kysely-plugin.js";
import { registerAuthRoutes } from "./routes/auth/index.js";

const fastify = Fastify({
	logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

const app = fastify.withTypeProvider<ZodTypeProvider>().register(kyselyPlugin);

export type FastifyApp = typeof app;

registerAuthRoutes(app);

fastify.listen({ port: ENV_CONFIG.PORT, host: "0.0.0.0" });
