import mongoose, { Document, Schema } from "mongoose";

export interface IUserAnswer {
  question: string;
  answer: any;
  correctAnswer: any;
}

export interface IAssessmentAnswer extends Document {
  empId: any;
  trainingId: any;
  answers: IUserAnswer[];
  score: number;
  status: "pass" | "fail";
  submittedAt: Date;
}

const userAnswerSchema = new Schema<IUserAnswer>({
  question: { type: String, required: true },
  answer: { type: Schema.Types.Mixed, required: true },
  correctAnswer: { type: Schema.Types.Mixed, required: true },
});

const assessmentAnswerSchema = new Schema<IAssessmentAnswer>({
  empId: { type: Schema.Types.Mixed, required: true },
  trainingId: { type: Schema.Types.Mixed, required: true },
  answers: [userAnswerSchema],
  score: { type: Number, required: true },
  status: { type: String, enum: ["pass", "fail"], default: "fail" },
  submittedAt: { type: Date, default: Date.now },
});

export const AssessmentAnswer = mongoose.model<IAssessmentAnswer>(
  "AssessmentAnswer",
  assessmentAnswerSchema
);
