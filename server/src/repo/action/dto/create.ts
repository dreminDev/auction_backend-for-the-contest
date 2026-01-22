import type { Prisma } from "@prisma/client";

export type CreateActionIn = Prisma.ActionCreateInput;

export type CreateWinnerActionIn = {
    userId: number;
    auctionId: string;
    round: number;
    amount: number;
    place: number;
    giftCollectionId: string;
    addedAt: Date;
};
