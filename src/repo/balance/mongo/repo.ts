import type { PrismaClient } from "@prisma/client";

import { createBalance } from "./create";
import {
    fetchBalanceByIdAndType,
    fetchBalancesByUserId,
} from "./fetch";

export class BalanceRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createBalance = createBalance;
    fetchBalanceByIdAndType = fetchBalanceByIdAndType;
    fetchBalancesByUserId = fetchBalancesByUserId;
}
