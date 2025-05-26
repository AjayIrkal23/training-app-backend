import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";
const JWT_EXPIRES_IN = "7d"; // adjust as needed

export interface IAssignedTraining {
  trainingId: mongoose.Types.ObjectId;
  status: "assigned" | "in-progress" | "completed" | "delayed";
  score: number;
  completedOn?: Date;
  result?: "passed" | "failed";
}

export interface IUser extends Document {
  empId: string;
  password?: any;
  active: boolean;
  emailSent: boolean;
  name: string;
  designation: string;
  company: string;
  mobileNumber: string;
  emailId: string;
  department: string;
  jwtoken?: string;
  assignedTrainings: IAssignedTraining[];
  generateJWT(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const assignedTrainingSchema = new Schema<IAssignedTraining>({
  trainingId: {
    type: Schema.Types.ObjectId,
    ref: "TrainingModule",
    required: true,
  },
  status: {
    type: String,
    enum: ["assigned", "in-progress", "completed", "delayed"],
    default: "assigned",
  },
  score: { type: Number, default: 0 },
  completedOn: { type: Date },
  result: {
    type: String,
    enum: ["passed", "failed"],
    required: false,
  },
});

const userSchema = new Schema<IUser>(
  {
    empId: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
    name: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    mobileNumber: {
      type: String,
      required: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    department: { type: String, required: true, trim: true },
    jwtoken: { type: String }, // JWT token storage
    assignedTrainings: { type: [assignedTrainingSchema], default: [] },
  },
  { timestamps: true }
);

// 🔐 Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Generate JWT
userSchema.methods.generateJWT = function (): string {
  const payload = {
    _id: this._id,
    email: this.emailId,
    empId: this.empId,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  this.jwtoken = token;
  return token;
};

// 🔒 Password comparison
userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
