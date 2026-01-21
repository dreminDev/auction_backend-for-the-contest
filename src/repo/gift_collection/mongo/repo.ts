import type { PrismaClient } from "@prisma/client";

import {
    fetchGiftCollection,
    fetchGiftCollections,
    fetchGiftsCollection,
} from "./fetch";

export class GiftCollectionRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    fetchGiftsCollection = fetchGiftsCollection;
    fetchGiftCollection = fetchGiftCollection;
    fetchGiftCollections = fetchGiftCollections;
}
