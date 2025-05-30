import fp from "fastify-plugin";
import { createBullBoard } from "@bull-board/api";
import { FastifyAdapter } from "@bull-board/fastify";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { assignTrainingQueue } from "queues/assignTrainingQueue";

export default fp(async (fastify) => {
  const serverAdapter = new FastifyAdapter();

  // ✅ Create BullBoard with your queue(s)
  createBullBoard({
    queues: [new BullMQAdapter(assignTrainingQueue)], // 👈 Add queue(s) here
    serverAdapter,
  });

  // ✅ Mount BullBoard at /admin/queues
  await fastify.register(serverAdapter.registerPlugin(), {
    basePath: "/admin/queues",
  });
});
