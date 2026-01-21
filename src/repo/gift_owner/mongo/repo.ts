import type { PrismaClient } from "@prisma/client";

import { createGiftOwner } from "./create";
import { fetchGiftOwner } from "./fetch";

export class GiftOwnerRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createGiftOwner = createGiftOwner;
    fetchGiftOwner = fetchGiftOwner;
}
