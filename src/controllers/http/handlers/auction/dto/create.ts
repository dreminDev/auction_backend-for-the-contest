import type { Auction } from "@prisma/client";

export type CreateAuctionIn = Omit<
    Auction,
    "id" | "addedAt" | "endedAt" | "status" | "currentRound"
>;
