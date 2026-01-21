import type { Prisma } from "@prisma/client";

import type { FetchGiftCollectionIn } from "../dto/fetch";
import type { GiftCollectionRepo } from "./repo";

export async function fetchGiftCollection(
    this: GiftCollectionRepo,
    input: FetchGiftCollectionIn
) {
    const where: Prisma.GiftCollectionWhereInput = {};

    if ("id" in input) {
        where.id = input.id;
    }
    if ("collection" in input) {
        where.collection = input.collection;
    }

    const giftCollection = await this.db.giftCollection.findFirst({
        where,
    });

    return giftCollection;
}

export async function fetchGiftCollections(this: GiftCollectionRepo) {
    const giftCollections = await this.db.giftCollection.findMany();

    return giftCollections;
}
