import mongoose from "mongoose";
import { Schema } from "mongoose";

export interface INote extends Document {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    collaborators: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const noteSchema : Schema = new Schema({
    title: { type: String, required: [true, 'Please add a title'] },
    content: { type: String, required: [true, 'Please add content'] },
    owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });

export default mongoose.model<INote>('Note', noteSchema);

