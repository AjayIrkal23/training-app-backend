import fp from "fastify-plugin";
import cors from "@fastify/cors";

export default fp(async (fastify) => {
  await fastify.register(cors, {
    origin: "*", // or use your frontend URL e.g. http://localhost:5173
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ⬅️ important!
    allowedHeaders: ["Content-Type", "Authorization"], // ⬅️ for bearer tokens
    credentials: true,
  });
});
