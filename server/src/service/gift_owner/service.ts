import type { GiftOwnerRepo } from "../../repo/gift_owner/mongo/repo";
import type { TxClient } from "../../repo/utils/tx";
import type { GiftCollectionService } from "../gift_collection/service";
import { createGiftOwner, createGiftOwnerUnique } from "./create";
import { countGiftOwnersByGiftId, fetchGiftOwner, fetchGiftOwnersByUserId } from "./fetch";

export class GiftOwnerService {
    protected giftOwnerRepo: GiftOwnerRepo;
    protected giftCollectionService: GiftCollectionService;
    protected tx?: TxClient;

    constructor(giftOwnerRepo: GiftOwnerRepo, giftCollectionService: GiftCollectionService) {
        this.giftOwnerRepo = giftOwnerRepo;
        this.giftCollectionService = giftCollectionService;
    }

    createGiftOwner = createGiftOwner;
    fetchGiftOwner = fetchGiftOwner;
    fetchGiftOwnersByUserId = fetchGiftOwnersByUserId;
    createGiftOwnerUnique = createGiftOwnerUnique;
    countGiftOwnersByGiftId = countGiftOwnersByGiftId;

    withTx(tx: TxClient): this {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, { tx });
    }
}
