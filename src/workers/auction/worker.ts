import type { PrismaClient } from "@prisma/client";
import { Mutex } from "async-mutex";

import type { AuctionService } from "../../service/auction/service";
import type { AuctionBidService } from "../../service/bid/auction/service";
import type { GiftCollectionService } from "../../service/gift_collection/service";
import type { GiftOwnerService } from "../../service/gift_owner/service";
import { auctionEnd } from "./auction_end";

export class AuctionWorker {
    protected readonly db: PrismaClient;
    protected readonly auctionBidService: AuctionBidService;
    protected readonly auctionService: AuctionService;
    protected readonly giftCollectionService: GiftCollectionService;
    protected readonly giftOwnerService: GiftOwnerService;

    protected mutex = new Mutex();
    protected auctionEndInterval: NodeJS.Timeout | null = null;

    constructor(
        db: PrismaClient,
        auctionBidService: AuctionBidService,
        auctionService: AuctionService,
        giftCollectionService: GiftCollectionService,
        giftOwnerService: GiftOwnerService
    ) {
        this.db = db;
        this.auctionBidService = auctionBidService;
        this.auctionService = auctionService;
        this.giftCollectionService = giftCollectionService;
        this.giftOwnerService = giftOwnerService;
    }

    auctionEnd = auctionEnd;

    startChecking(intervalMs: number = 1000) {
        this.auctionEndInterval = setInterval(() => {
            this.auctionEnd();
        }, intervalMs);
    }

    async setup() {
        await this.startChecking();
    }
}
