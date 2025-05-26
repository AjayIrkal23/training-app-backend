import { FastifyRequest, FastifyReply } from "fastify";
import {
  AssessmentTemplate,
  IAssessmentTemplate,
} from "../models/AssesmentTemplate";

// Create a new template
export const createAssessmentTemplate = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const template = new AssessmentTemplate(req.body);
    await template.save();
    return reply.code(201).send(template);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to create template", error });
  }
};

// Get all templates
export const getAllAssessmentTemplates = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const templates = await AssessmentTemplate.find();
    return reply.send(templates);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to fetch templates", error });
  }
};

// Get template by templateId
export const getAssessmentTemplateById = async (
  req: FastifyRequest<{ Params: { templateId: string } }>,
  reply: FastifyReply
) => {
  try {
    const template = await AssessmentTemplate.findOne({
      templateId: parseInt(req.params.templateId),
    });
    if (!template) {
      return reply.code(404).send({ message: "Template not found" });
    }
    return reply.send(template);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to fetch template", error });
  }
};

// Edit template
export const updateAssessmentTemplate = async (
  req: FastifyRequest<{
    Params: { templateId: string };
    Body: Partial<IAssessmentTemplate>;
  }>,
  reply: FastifyReply
) => {
  try {
    const updated = await AssessmentTemplate.findOneAndUpdate(
      { templateId: parseInt(req.params.templateId) },
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return reply.code(404).send({ message: "Template not found" });
    }
    return reply.send(updated);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to update template", error });
  }
};

// Delete template
export const deleteAssessmentTemplate = async (
  req: FastifyRequest<{ Params: { templateId: string } }>,
  reply: FastifyReply
) => {
  try {
    const deleted = await AssessmentTemplate.findOneAndDelete({
      templateId: parseInt(req.params.templateId),
    });
    if (!deleted) {
      return reply.code(404).send({ message: "Template not found" });
    }
    return reply.send({ message: "Template deleted successfully" });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to delete template", error });
  }
};
