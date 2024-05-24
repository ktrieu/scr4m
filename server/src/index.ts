import Fastify from "fastify";
import { ENV_CONFIG } from "./env";

const fastify = Fastify({
    logger: true
})

fastify.get("/", (request, reply) => {
    reply.send("yeah that's great")
});

fastify.listen({ port: ENV_CONFIG.PORT, host: '0.0.0.0' })