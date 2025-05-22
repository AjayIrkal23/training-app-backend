import mongoose, { Document, Schema } from "mongoose";

export interface IAssessment {
  question: string;
  options?: string[];
  correctAnswer?: string;
  type: "mcq" | "input";
}

export interface ITrainingModule extends Document {
  trainingName: string;
  trainingId: string;
  videos: string[];
  assessments: IAssessment[];
  category: string;
  completionDate: Date;
  createdBy: mongoose.Types.ObjectId;
  departments: string[];
  designations: string[];
  template: any[]; // Flexible template structure
  notified: boolean;
  createdAt: Date;
}

const assessmentSchema = new Schema<IAssessment>({
  question: String,
  options: [String],
  correctAnswer: String,
  type: { type: String, enum: ["mcq", "input"], default: "mcq" },
});

const trainingModuleSchema = new Schema<ITrainingModule>({
  trainingName: { type: String, required: true },
  trainingId: { type: String, required: true, unique: true },
  videos: [String],
  assessments: [assessmentSchema],
  category: String,
  completionDate: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  departments: [String],
  designations: [String],
  template: [Schema.Types.Mixed],
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const TrainingModule = mongoose.model<ITrainingModule>(
  "TrainingModule",
  trainingModuleSchema
);
