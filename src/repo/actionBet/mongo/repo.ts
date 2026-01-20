import type { PrismaClient } from "@prisma/client";

import { fetchAuctionLastBetByAuctionId } from "./fetch";

export class ActionBetRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    fetchAuctionLastBetByAuctionId = fetchAuctionLastBetByAuctionId;
}
