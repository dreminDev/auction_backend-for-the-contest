import type { PrismaClient } from "@prisma/client";

export class UserRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }
}
