import type { PrismaClient } from "@prisma/client";

export class GiftCollectionRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }
}
