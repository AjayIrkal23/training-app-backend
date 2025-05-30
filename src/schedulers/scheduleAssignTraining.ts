// schedulers/scheduleAssignTraining.ts
import { assignTrainingQueue } from "../queues/assignTrainingQueue";

export const scheduleTrainingJob = async () => {
  await assignTrainingQueue.add(
    "assign-job",
    {},
    {
      repeat: {
        pattern: "*/5 * * * *", // Every 5 minutes
      },
      removeOnComplete: true,
    }
  );
};
