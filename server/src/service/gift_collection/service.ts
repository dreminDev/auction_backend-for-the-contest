import type { GiftCollectionRepo } from "../../repo/gift_collection/mongo/repo";
import type { GiftOwnerRepo } from "../../repo/gift_owner/mongo/repo";
import {
    fetchGiftCollection,
    fetchGiftCollections,
    fetchGiftCollectionsWithAvailable,
    fetchGiftsCollection,
} from "./fetch";

export class GiftCollectionService {
    protected giftCollectionRepo: GiftCollectionRepo;
    protected giftOwnerRepo?: GiftOwnerRepo;

    constructor(giftCollectionRepo: GiftCollectionRepo, giftOwnerRepo?: GiftOwnerRepo) {
        this.giftCollectionRepo = giftCollectionRepo;
        this.giftOwnerRepo = giftOwnerRepo;
    }

    fetchGiftsCollection = fetchGiftsCollection;
    fetchGiftCollection = fetchGiftCollection;
    fetchGiftCollections = fetchGiftCollections;
    fetchGiftCollectionsWithAvailable = fetchGiftCollectionsWithAvailable;
}
