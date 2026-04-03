import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
}

export interface ITest extends Document {
  title: string;
  description: string;
  subject: string;
  duration: number;
  totalMarks: number;
  questions: IQuestion[];
  createdBy: mongoose.Types.ObjectId;
  scheduledAt?: Date;
  dueDate?: Date;
  status: "active" | "completed";
  assignedTo: string[];
  createdAt: Date;
}

const testSchema = new Schema<ITest>({
  title: { type: String, required: true },
  description: { type: String },
  subject: { type: String, required: true },
  duration: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  scheduledAt: { type: Date },
  dueDate: { type: Date },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  assignedTo: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITest>("Test", testSchema);
