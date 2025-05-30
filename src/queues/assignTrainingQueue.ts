// queues/assignTrainingQueue.ts
import { Queue } from "bullmq";
import { redis } from "../utils/redis";

export const assignTrainingQueue = new Queue("assignTrainings", {
  connection: redis,
});
