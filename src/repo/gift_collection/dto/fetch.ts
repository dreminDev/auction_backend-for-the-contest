import type { GiftType } from "@prisma/client";

type GiftCollectionIdIn = {
    id: string;
};

type FetchGiftCollectionOut = {
    collection: GiftType;
};

export type FetchGiftCollectionIn = GiftCollectionIdIn | FetchGiftCollectionOut;
