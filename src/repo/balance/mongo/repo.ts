import type { PrismaClient } from "@prisma/client";

import { createBalance } from "./create";
import { fetchBalance } from "./fetch";

export class BalanceRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createBalance = createBalance;
    fetchBalance = fetchBalance;
}
