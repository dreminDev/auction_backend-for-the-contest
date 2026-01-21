import type { GiftOwnerRepo } from "../../repo/gift_owner/mongo/repo";
import type { GiftCollectionService } from "../gift_collection/service";
import { createGiftOwner, createGiftOwnerUnique } from "./create";
import { fetchGiftOwner, fetchGiftOwnersByUserId } from "./fetch";

export class GiftOwnerService {
    protected giftOwnerRepo: GiftOwnerRepo;
    protected giftCollectionService: GiftCollectionService;

    constructor(giftOwnerRepo: GiftOwnerRepo, giftCollectionService: GiftCollectionService) {
        this.giftOwnerRepo = giftOwnerRepo;
        this.giftCollectionService = giftCollectionService;
    }

    createGiftOwner = createGiftOwner;
    fetchGiftOwner = fetchGiftOwner;
    fetchGiftOwnersByUserId = fetchGiftOwnersByUserId;
    createGiftOwnerUnique = createGiftOwnerUnique;
}
