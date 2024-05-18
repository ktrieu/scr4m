import Fastify from "fastify";

const fastify = Fastify({
    logger: true
})

fastify.get("/", (request, reply) => {
    reply.send("yeah that's great")
});

fastify.listen({ port: +(process.env.PORT ?? 3000), host: '0.0.0.0' })