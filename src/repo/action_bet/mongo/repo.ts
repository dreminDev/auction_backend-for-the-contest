import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createAuctionBet } from "./create";
import { fetchAuctionBets, fetchAuctionLastBetByAuctionId } from "./fetch";

export class ActionBetRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAuctionBet = createAuctionBet;
    fetchAuctionBets = fetchAuctionBets;
    fetchAuctionLastBetByAuctionId = fetchAuctionLastBetByAuctionId;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
