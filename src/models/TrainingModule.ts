// models/TrainingModule.ts
import mongoose, { Document, Schema } from "mongoose";
import { Counter } from "./Counter"; // import the counter model

export interface ITrainingModule extends Document {
  trainingName: string;
  trainingId: number; // use number, not string
  videos: string[];
  assessmentTemplateIds: Schema.Types.Mixed[];
  category: string;
  completionDate: Date;
  departments: string[];
  designations: string[];
  template: any[];
  notified: boolean;
  createdAt: Date;
}

const trainingModuleSchema = new Schema<ITrainingModule>({
  trainingName: { type: String, required: true, unique: true },
  trainingId: { type: Number, unique: true }, // auto-generated
  videos: [String],
  assessmentTemplateIds: [{ type: Schema.Types.Mixed }],
  category: String,
  completionDate: Date,
  departments: [String],
  designations: [String],
  template: [Schema.Types.Mixed],
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

// Pre-save hook to auto-increment trainingId
trainingModuleSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: "trainingId" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.trainingId = counter.value;
  }
  next();
});

export const TrainingModule = mongoose.model<ITrainingModule>(
  "TrainingModule",
  trainingModuleSchema
);
