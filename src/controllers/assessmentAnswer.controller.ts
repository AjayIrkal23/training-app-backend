import { FastifyReply, FastifyRequest } from "fastify";
import {
  AssessmentAnswer,
  IAssessmentAnswer,
} from "../models/AssessmentAnswer";

// Create answer
export const createAssessmentAnswer = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const answer = new AssessmentAnswer(req.body);
    await answer.save();
    return reply.code(201).send(answer);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to create answer", error });
  }
};

// Get all answers
export const getAllAssessmentAnswers = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const answers = await AssessmentAnswer.find();
    return reply.send(answers);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to fetch answers", error });
  }
};

// Get answer by trainingId and userId
export const getAssessmentAnswerByTrainingAndUser = async (
  req: FastifyRequest<{ Params: { trainingId: string; userId: string } }>,
  reply: FastifyReply
) => {
  try {
    const answer = await AssessmentAnswer.findOne({
      trainingId: req.params.trainingId,
      userId: req.params.userId,
    });

    if (!answer) {
      return reply.code(404).send({ message: "Answer not found" });
    }

    return reply.send(answer);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to fetch answer", error });
  }
};

export const updateAssessmentAnswer = async (
  req: FastifyRequest<{
    Params: { id: string };
    Body: Partial<IAssessmentAnswer>;
  }>,
  reply: FastifyReply
) => {
  try {
    const updated = await AssessmentAnswer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return reply.code(404).send({ message: "Answer not found" });
    }

    return reply.send(updated);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to update answer", error });
  }
};

// Delete answer by ID
export const deleteAssessmentAnswer = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const deleted = await AssessmentAnswer.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return reply.code(404).send({ message: "Answer not found" });
    }
    return reply.send({ message: "Answer deleted successfully" });
  } catch (error) {
    return reply.code(500).send({ message: "Failed to delete answer", error });
  }
};
