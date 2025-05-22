import mongoose, { Document, Schema } from "mongoose";

export interface IUserAnswer {
  question: string;
  answer: any;
}

export interface IAssessmentAnswer extends Document {
  userId: mongoose.Types.ObjectId;
  trainingId: mongoose.Types.ObjectId;
  answers: IUserAnswer[];
  score: number;
  status: "pass" | "fail";
  submittedAt: Date;
}

const userAnswerSchema = new Schema<IUserAnswer>({
  question: String,
  answer: Schema.Types.Mixed,
});

const assessmentAnswerSchema = new Schema<IAssessmentAnswer>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  trainingId: {
    type: Schema.Types.ObjectId,
    ref: "TrainingModule",
    required: true,
  },
  answers: [userAnswerSchema],
  score: Number,
  status: { type: String, enum: ["pass", "fail"], default: "fail" },
  submittedAt: { type: Date, default: Date.now },
});

export const AssessmentAnswer = mongoose.model<IAssessmentAnswer>(
  "AssessmentAnswer",
  assessmentAnswerSchema
);
