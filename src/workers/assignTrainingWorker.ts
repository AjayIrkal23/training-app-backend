// workers/assignTrainingWorker.ts
import { Worker } from "bullmq";
import { redis } from "../utils/redis";
import { assignTrainingsToUsers } from "./../jobs/scheduleAssignTraining";

export const assignTrainingWorker = new Worker(
  "assignTrainings",
  async () => {
    await assignTrainingsToUsers();
  },
  {
    connection: redis,
  }
);
