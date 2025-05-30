import Fastify from "fastify";
import dotenv from "dotenv";
dotenv.config();

// 🔌 Plugin Imports
import cors from "./plugins/cors";
import helmet from "./plugins/helmet";
import swagger from "./plugins/swagger";
import socket from "./plugins/socket";
import rateLimit from "./plugins/rate-limit";
import multipart from "./plugins/multipart";
import staticFiles from "./plugins/static";
import compress from "./plugins/compress";
import sensible from "./plugins/sensible";
import arena from "./dashboard/arena";
import "./workers/assignTrainingWorker";

// 🧩 Route Imports
import { userRoutes } from "./routes/user.routes";
import { trainingRoutes } from "./routes/training.routes";
import { assessmentTemplateRoutes } from "./routes/assessmentTemplate.routes";
import { assessmentAnswerRoutes } from "./routes/assessmentAnswer.routes";

// 📦 Model Imports (for index sync)
import { TrainingModule } from "./models/TrainingModule";
import { AssessmentTemplate } from "./models/AssesmentTemplate";
import { AssessmentAnswer } from "./models/AssessmentAnswer";
import { User } from "./models/User";
import { scheduleTrainingJob } from "./schedulers/scheduleAssignTraining";
import { assignTrainingsToUsers } from "./jobs/scheduleAssignTraining";

// 🚀 App Factory
export const buildApp = () =>
  Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    },
  });

// 🛠 Index Sync Scheduler
export const syncAllIndexes = async () => {
  try {
    await TrainingModule.syncIndexes();
    await AssessmentTemplate.syncIndexes();
    await AssessmentAnswer.syncIndexes();
    await User.syncIndexes();
    console.log(`[${new Date().toISOString()}] Index sync complete ✅`);
  } catch (err) {
    console.error("Error syncing indexes:", err);
  }
};

export const startIndexSyncScheduler = () => {
  syncAllIndexes(); // Initial sync
  setInterval(syncAllIndexes, 8 * 60 * 60 * 1000); // Every 8 hours
};

// 🧩 Plugin + Route Registration
export const registerAppPlugins = async (app: ReturnType<typeof buildApp>) => {
  // 🔌 Core Plugins
  await app.register(cors);
  await app.register(helmet);
  await app.register(swagger);
  await app.register(socket);
  await app.register(rateLimit);
  await app.register(multipart);
  await app.register(staticFiles);
  await app.register(compress);
  await app.register(sensible);
  await app.register(arena);

  // 🧩 Routes
  await app.register(userRoutes, { prefix: "/api/users" });
  await app.register(trainingRoutes, { prefix: "/api/training" });
  await app.register(assessmentTemplateRoutes, { prefix: "/api/assessments" });
  await app.register(assessmentAnswerRoutes, {
    prefix: "/api/assessment-answers",
  });

  // 🕒 Schedule periodic index sync
  startIndexSyncScheduler();

  // Redis
  await scheduleTrainingJob();

  await assignTrainingsToUsers();
};
