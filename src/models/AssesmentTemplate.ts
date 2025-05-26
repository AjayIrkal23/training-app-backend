// models/AssessmentTemplate.ts
import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "./Counter"; // Import counter

export interface IAssessmentQuestion {
  id: string;
  type: "mcq" | "input";
  question: string;
  options?: string[];
  correctAnswer: string;
}

export interface IAssessmentTemplate extends Document {
  templateId: number; // Add templateId
  name: string;
  department: string;
  questions: IAssessmentQuestion[];
  createdAt: Date;
}

const assessmentQuestionSchema = new Schema<IAssessmentQuestion>(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ["mcq", "input"], required: true },
    question: { type: String, required: true },
    options: [String],
    correctAnswer: { type: String, required: true },
  },
  { _id: false }
);

const assessmentTemplateSchema = new Schema<IAssessmentTemplate>({
  templateId: { type: Number, unique: true }, // Add templateId
  name: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  questions: [assessmentQuestionSchema],
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to assign templateId
assessmentTemplateSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "templateId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.templateId = counter.value;
  }
  next();
});

export const AssessmentTemplate = mongoose.model<IAssessmentTemplate>(
  "AssessmentTemplate",
  assessmentTemplateSchema
);
