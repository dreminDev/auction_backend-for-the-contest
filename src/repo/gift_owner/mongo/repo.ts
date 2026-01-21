import type { PrismaClient } from "@prisma/client";

export class GiftOwnerRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }
}
