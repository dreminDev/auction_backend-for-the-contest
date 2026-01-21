import type { PrismaClient } from "@prisma/client";

import { fetchGiftCollection, fetchGiftCollections } from "./fetch";

export class GiftCollectionRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    fetchGiftCollection = fetchGiftCollection;
    fetchGiftCollections = fetchGiftCollections;
}
