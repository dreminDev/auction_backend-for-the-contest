import { Mutex } from "async-mutex";

import type { AuctionService } from "../../service/auction/service";
import type { AuctionBidService } from "../../service/bid/auction/service";
import { auctionEnd } from "./auction_end";

export class AuctionWorker {
    protected readonly auctionBidService: AuctionBidService;
    protected readonly auctionService: AuctionService;

    protected mutex = new Mutex();
    protected auctionEndInterval: NodeJS.Timeout | null = null;

    constructor(
        auctionBidService: AuctionBidService,
        auctionService: AuctionService
    ) {
        this.auctionBidService = auctionBidService;
        this.auctionService = auctionService;
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
