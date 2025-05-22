import mongoose, { Document, Schema } from "mongoose";

export interface IAssignedTraining {
  trainingId: mongoose.Types.ObjectId;
  status: "assigned" | "in-progress" | "completed" | "delayed"; // updated
  score: number;
  completedOn?: Date;
}

export interface IUser extends Document {
  empId: string;
  password: string;
  active: boolean;
  emailSent: boolean;
  name: string;
  designation: string;
  company: string;
  mobileNumber: string;
  emailId: string;
  department: string;
  assignedTrainings: IAssignedTraining[];
}

const assignedTrainingSchema = new Schema<IAssignedTraining>({
  trainingId: { type: Schema.Types.ObjectId, ref: "TrainingModule" },
  status: {
    type: String,
    enum: ["assigned", "in-progress", "completed", "delayed"],
    default: "assigned",
  },
  score: { type: Number, default: 0 },
  completedOn: { type: Date },
});

const userSchema = new Schema<IUser>({
  empId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: false },
  emailSent: { type: Boolean, default: false },
  name: String,
  designation: String,
  company: String,
  mobileNumber: String,
  emailId: { type: String, unique: true },
  department: String,
  assignedTrainings: [assignedTrainingSchema],
});

export const User = mongoose.model<IUser>("User", userSchema);
