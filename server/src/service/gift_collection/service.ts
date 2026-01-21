import type { GiftCollectionRepo } from "../../repo/gift_collection/mongo/repo";
import { fetchGiftCollection, fetchGiftCollections, fetchGiftsCollection } from "./fetch";

export class GiftCollectionService {
    protected giftCollectionRepo: GiftCollectionRepo;

    constructor(giftCollectionRepo: GiftCollectionRepo) {
        this.giftCollectionRepo = giftCollectionRepo;
    }

    fetchGiftsCollection = fetchGiftsCollection;
    fetchGiftCollection = fetchGiftCollection;
    fetchGiftCollections = fetchGiftCollections;
}
