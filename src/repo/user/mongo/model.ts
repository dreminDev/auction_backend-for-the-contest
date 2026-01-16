import { Schema, model } from "mongoose";
import type { User } from "../../../model/user";

export const UserSchema = new Schema<User>({
    userId: { type: Number, required: true, unique: true, index: true },
    username: { type: String },
    info: {
        first_name: { type: String },
        last_name: { type: String },
        photo_url: { type: String },
        username: { type: String },
    },
    addedAt: { type: Date, default: () => new Date() },
});

export const UserModel = model<User>("users", UserSchema);
