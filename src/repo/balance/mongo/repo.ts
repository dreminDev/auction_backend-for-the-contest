import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createBalance } from "./create";
import { fetchBalanceByIdAndType, fetchBalancesByUserId } from "./fetch";
import { updateBalance } from "./update";

export class BalanceRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createBalance = createBalance;
    fetchBalanceByIdAndType = fetchBalanceByIdAndType;
    fetchBalancesByUserId = fetchBalancesByUserId;
    updateBalance = updateBalance;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
