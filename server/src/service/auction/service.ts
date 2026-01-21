import type { AuctionRepo } from "../../repo/auction/mongo/repo";
import type { GiftCollectionService } from "../gift_collection/service";
import type { GiftOwnerService } from "../gift_owner/service";
import { createAuction } from "./create";
import { fetchAuction, fetchAuctionListByStatus } from "./fetch";

export class AuctionService {
    protected auctionRepo: AuctionRepo;
    protected giftCollectionService: GiftCollectionService;
    protected giftOwnerService?: GiftOwnerService;

    constructor(
        auctionRepo: AuctionRepo,
        giftCollectionService: GiftCollectionService,
        giftOwnerService?: GiftOwnerService
    ) {
        this.auctionRepo = auctionRepo;
        this.giftCollectionService = giftCollectionService;
        this.giftOwnerService = giftOwnerService;
    }

    createAuction = createAuction;
    fetchAuction = fetchAuction;
    fetchAuctionListByStatus = fetchAuctionListByStatus;
}
