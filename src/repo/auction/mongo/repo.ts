import type { PrismaClient } from "@prisma/client";
import { createAuction } from "./create";
import { fetchAuction, fetchAuctionListByStatus } from "./fetch";

export class AuctionRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAuction = createAuction;
    fetchAuction = fetchAuction;
    fetchAuctionListByStatus = fetchAuctionListByStatus;
}
