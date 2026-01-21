import type { BalanceType } from "@prisma/client";

export type NewBetIn = {
    auctionId: string;
    amount: number;
    userId: number;
    balanceType: BalanceType;
};
