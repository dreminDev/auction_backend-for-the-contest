import type { Document } from "mongoose";

export type ActionType = "balance" | "bet";

export interface Action extends Document {
    userId: number;
    action: ActionType;
    amount: number; 
    addedAt: Date;
}
