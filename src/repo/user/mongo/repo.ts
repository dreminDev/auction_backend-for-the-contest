import type { PrismaClient } from "@prisma/client";

export class UserRepo {
    db: PrismaClient;

    constructor(database: PrismaClient) {
        this.db = database;
    }
}
