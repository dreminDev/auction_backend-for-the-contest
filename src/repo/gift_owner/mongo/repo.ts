import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createGiftOwner, createManyGiftOwners } from "./create";
import { fetchGiftOwner, fetchGiftOwnerLastSerialNumber } from "./fetch";

export class GiftOwnerRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createGiftOwner = createGiftOwner;
    createManyGiftOwners = createManyGiftOwners;
    fetchGiftOwner = fetchGiftOwner;
    fetchGiftOwnerLastSerialNumber = fetchGiftOwnerLastSerialNumber;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
