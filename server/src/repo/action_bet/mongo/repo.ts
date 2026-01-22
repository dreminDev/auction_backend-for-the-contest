import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createAuctionBet } from "./create";
import { deleteManyAuctionBets } from "./delete";
import {
    fetchAuctionBets,
    fetchAuctionLastBetByAuctionId,
    fetchUserBetsByAuctionIdAndUserId,
} from "./fetch";
import { updateAuctionBet, updateManyAuctionBets } from "./update";

export class ActionBetRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAuctionBet = createAuctionBet;
    fetchAuctionBets = fetchAuctionBets;
    fetchAuctionLastBetByAuctionId = fetchAuctionLastBetByAuctionId;
    fetchUserBetsByAuctionIdAndUserId = fetchUserBetsByAuctionIdAndUserId;
    updateAuctionBet = updateAuctionBet;
    updateManyAuctionBets = updateManyAuctionBets;
    deleteManyAuctionBets = deleteManyAuctionBets;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
