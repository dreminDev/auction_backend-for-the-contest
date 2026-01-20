import type { PrismaClient } from "@prisma/client";

import { fetchAuctionBets, fetchAuctionLastBetByAuctionId } from "./fetch";

export class ActionBetRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    fetchAuctionBets = fetchAuctionBets;
    fetchAuctionLastBetByAuctionId = fetchAuctionLastBetByAuctionId;
}
