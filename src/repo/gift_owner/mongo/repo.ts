import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createGiftOwner, createManyGiftOwners } from "./create";
import { fetchGiftOwner, fetchGiftOwnerLastSerialNumber, fetchGiftOwnersByUserId } from "./fetch";

export class GiftOwnerRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createGiftOwner = createGiftOwner;
    createManyGiftOwners = createManyGiftOwners;
    fetchGiftOwner = fetchGiftOwner;
    fetchGiftOwnersByUserId = fetchGiftOwnersByUserId;
    fetchGiftOwnerLastSerialNumber = fetchGiftOwnerLastSerialNumber;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
