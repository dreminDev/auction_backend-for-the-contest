import type { Prisma } from "@prisma/client";

export type FetchGiftOwnerIn = Prisma.GiftOwnerWhereInput;

export type FetchGiftOwnersByUserIdIn = {
    userId: number;
};

export type FetchGiftOwnerLastSerialNumberIn = {
    giftId: string;
};

export type CountGiftOwnersByGiftIdIn = {
    giftId: string;
};
