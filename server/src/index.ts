import Fastify from "fastify";
import { ENV_CONFIG } from "./env";
import { ZodTypeProvider, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { kyselyPlugin } from "./kysely-plugin";
import { RegisterBodySchema } from "@scr4m/common";

const fastify = Fastify({
    logger: true
})

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler)

const app = fastify.withTypeProvider<ZodTypeProvider>().register(kyselyPlugin);

RegisterBodySchema.parse({});

export type FastifyApp = typeof app;

app.get("/", async (request, reply) => {
    const result = await request.server.db.selectFrom("companies").select(({ fn, val, ref }) => [
        fn.count("companies.id").as("num_companies")
    ]).execute();

    reply.send(`${result[0].num_companies} companies!`)
})

fastify.listen({ port: ENV_CONFIG.PORT, host: '0.0.0.0' })