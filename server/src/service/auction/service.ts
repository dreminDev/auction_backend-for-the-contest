import type { AuctionRepo } from "../../repo/auction/mongo/repo";
import type { TxClient } from "../../repo/utils/tx";
import type { GiftCollectionService } from "../gift_collection/service";
import type { GiftOwnerService } from "../gift_owner/service";
import { createAuction } from "./create";
import { fetchAuction, fetchAuctionListByStatus } from "./fetch";
import { updateAuction } from "./update";

export class AuctionService {
    protected auctionRepo: AuctionRepo;
    protected giftCollectionService: GiftCollectionService;
    protected giftOwnerService?: GiftOwnerService;
    protected tx?: TxClient;

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
    updateAuction = updateAuction;

    withTx(tx: TxClient): this {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, { tx });
    }
}
