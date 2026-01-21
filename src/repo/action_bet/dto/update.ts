import type { Prisma } from "@prisma/client";

export type UpdateAuctionBetIn = {
    id: string;
    amount?: number;
    round?: number;
    metaData?: Prisma.InputJsonValue;
};

export type UpdateManyAuctionBetsIn = {
    ids: string[];
    round?: number;
    metaData?: Prisma.InputJsonValue;
};
