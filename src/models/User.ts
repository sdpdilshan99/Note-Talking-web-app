import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
}, { timestamps: true });

//password hashing middleware
userSchema.pre<IUser>('save', async function (next) {
    if(!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
});

//method to compare password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);