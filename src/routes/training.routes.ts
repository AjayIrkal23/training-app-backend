// routes/training.routes.ts
import { FastifyInstance } from "fastify";
import {
  createTraining,
  getAllTrainings,
  getTrainingByTrainingId,
  updateTraining,
  deleteTraining,
} from "../controllers/training.controller";
import { verifyJWT } from "../plugins/auth.middleware";

export async function trainingRoutes(server: FastifyInstance) {
  // Apply middleware to all routes in this scope
  server.addHook("onRequest", verifyJWT);

  server.post("/createTrainings", createTraining);
  server.get("/trainings", getAllTrainings);
  server.get("/trainings/:trainingId", getTrainingByTrainingId);
  server.put("/trainings/:trainingId", updateTraining);
  server.delete("/trainings/:trainingId", deleteTraining);
}
