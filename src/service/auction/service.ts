import type { AuctionRepo } from "../../repo/auction/mongo/repo";
import { createAuction } from "./create";
import { fetchAuction, fetchAuctionListByStatus } from "./fetch";

export class AuctionService {
    protected auctionRepo: AuctionRepo;

    constructor(auctionRepo: AuctionRepo) {
        this.auctionRepo = auctionRepo;
    }

    createAuction = createAuction;
    fetchAuction = fetchAuction;
    fetchAuctionListByStatus = fetchAuctionListByStatus;
}
