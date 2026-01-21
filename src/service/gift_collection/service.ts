import type { GiftCollectionRepo } from "../../repo/gift_collection/mongo/repo";
import { fetchGiftCollection, fetchGiftCollections } from "./fetch";

export class GiftCollectionService {
    protected giftCollectionRepo: GiftCollectionRepo;

    constructor(giftCollectionRepo: GiftCollectionRepo) {
        this.giftCollectionRepo = giftCollectionRepo;
    }

    fetchGiftCollection = fetchGiftCollection;
    fetchGiftCollections = fetchGiftCollections;
}

