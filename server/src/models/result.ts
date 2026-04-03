import mongoose, { Schema, Document } from "mongoose";

export interface IResult extends Document {
  testId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: number[];
  score: number;
  percentage: number;
  timeTaken: number;
  submittedAt: Date;
}

const resultSchema = new Schema<IResult>({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  answers: [{ type: Number, required: true }],
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IResult>("Result", resultSchema);
