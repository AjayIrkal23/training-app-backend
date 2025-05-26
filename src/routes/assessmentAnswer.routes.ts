import { FastifyInstance } from "fastify";
import {
  createAssessmentAnswer,
  getAllAssessmentAnswers,
  getAssessmentAnswerByTrainingAndUser,
  updateAssessmentAnswer,
  deleteAssessmentAnswer,
} from "../controllers/assessmentAnswer.controller";

export async function assessmentAnswerRoutes(server: FastifyInstance) {
  server.post("/answers", createAssessmentAnswer);
  server.get("/answers", getAllAssessmentAnswers);
  server.get(
    "/answers/:trainingId/:userId",
    getAssessmentAnswerByTrainingAndUser
  );
  server.put("/answers/:id", updateAssessmentAnswer);
  server.delete("/answers/:id", deleteAssessmentAnswer);
}
