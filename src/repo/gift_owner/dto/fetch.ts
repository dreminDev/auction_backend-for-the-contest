import type { Prisma } from "@prisma/client";

export type FetchGiftOwnerIn = Prisma.GiftOwnerWhereInput;

export type FetchGiftOwnerLastSerialNumberIn = {
    giftId: string;
};
