import type { Document } from "mongoose";

// Можно добавлять с легкостью другие типы баланса. Если это потребуется.
export type BalanceType = "stars";

export interface Balance extends Document {
    userId: number;
    type: BalanceType;
    balance: number;
    addedAt: Date;
}
