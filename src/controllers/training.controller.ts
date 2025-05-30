import { FastifyRequest, FastifyReply } from "fastify";
import { TrainingModule } from "../models/TrainingModule";
import { assignTrainingsToUsers } from "./../jobs/scheduleAssignTraining";

// Create a new training
export const createTraining = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const training = new TrainingModule(req.body);
    await training.save();
    await assignTrainingsToUsers();
    return reply.code(201).send(training);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to create training", error });
  }
};

// Get all trainings
export const getAllTrainings = async (
  _req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const trainings = await TrainingModule.find();
    return reply.send(trainings);
  } catch (error) {
    return reply

      .code(500)
      .send({ message: "Failed to fetch trainings", error });
  }
};

// Get training by trainingId
export const getTrainingByTrainingId = async (
  req: FastifyRequest<{ Params: { trainingId: string } }>,
  reply: FastifyReply
) => {
  try {
    const training = await TrainingModule.findOne({
      trainingId: parseInt(req.params.trainingId),
    });
    if (!training)
      return reply.code(404).send({ message: "Training not found" });
    return reply.send(training);
  } catch (error) {
    return reply.code(500).send({ message: "Failed to fetch training", error });
  }
};

export const updateTraining = async (
  req: FastifyRequest<{
    Params: { trainingId: string };
    Body: Record<string, any>;
  }>,
  reply: FastifyReply
) => {
  try {
    const updatePayload = { $set: req.body };

    const updated = await TrainingModule.findOneAndUpdate(
      { trainingId: parseInt(req.params.trainingId) },
      updatePayload,
      { new: true }
    );

    if (!updated) {
      return reply.code(404).send({ message: "Training not found" });
    }

    await assignTrainingsToUsers();

    return reply.send(updated);
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to update training", error });
  }
};

// Delete training
export const deleteTraining = async (
  req: FastifyRequest<{ Params: { trainingId: string } }>,
  reply: FastifyReply
) => {
  try {
    const deleted = await TrainingModule.findOneAndDelete({
      trainingId: parseInt(req.params.trainingId),
    });
    if (!deleted)
      return reply.code(404).send({ message: "Training not found" });
    return reply.send({ message: "Training deleted successfully" });
  } catch (error) {
    return reply
      .code(500)
      .send({ message: "Failed to delete training", error });
  }
};
