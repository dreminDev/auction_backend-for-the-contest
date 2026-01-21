import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createAuction } from "./create";
import { fetchAuction, fetchAuctionListByStatus } from "./fetch";
import { updateAuction } from "./update";

export class AuctionRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAuction = createAuction;

    fetchAuction = fetchAuction;
    fetchAuctionListByStatus = fetchAuctionListByStatus;
    updateAuction = updateAuction;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
