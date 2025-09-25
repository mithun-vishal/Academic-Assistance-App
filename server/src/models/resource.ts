import { Schema, model, Document } from 'mongoose';

interface IResource extends Document {
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'article' | 'image' | 'presentation';
  subject: string;
  uploadedBy: string;
  uploadedAt: Date;
}

const resourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['pdf','video','article','image','presentation'], required: true },
  subject: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now }
});

export default model<IResource>('Resource', resourceSchema);
