import { Document } from "mongoose";

export interface User extends Document {
    userId: number;
    username: string;
    info: UserInfo;
    addedAt: Date;
}

export type UserInfo = {
    first_name: string;
    last_name: string;
    photo_url: string;
    username: string;
};
