import Fastify from "fastify";

const fastify = Fastify({
    logger: true
})

fastify.get("/", (request, reply) => {
    reply.send("yeah that's great?")
});

fastify.listen({ port: 6001 })