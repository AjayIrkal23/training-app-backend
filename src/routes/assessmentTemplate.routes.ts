// routes/assessmentTemplate.routes.ts
import { FastifyInstance } from "fastify";
import {
  createAssessmentTemplate,
  getAllAssessmentTemplates,
  getAssessmentTemplateById,
  updateAssessmentTemplate,
  deleteAssessmentTemplate,
} from "../controllers/assessmentTemplate.controller";
import { verifyJWT } from "../plugins/auth.middleware";

export async function assessmentTemplateRoutes(server: FastifyInstance) {
  // 🔐 Add auth middleware to all routes in this group
  server.addHook("onRequest", verifyJWT);

  server.post("/createTemplate", createAssessmentTemplate);
  server.get("/templates", getAllAssessmentTemplates);
  server.get("/templates/:templateId", getAssessmentTemplateById);
  server.put("/templates/:templateId", updateAssessmentTemplate);
  server.delete("/templates/:templateId", deleteAssessmentTemplate);
}
