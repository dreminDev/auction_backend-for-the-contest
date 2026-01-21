import type { FetchGiftCollectionIn } from "../../repo/gift_collection/dto/fetch";
import type { GiftCollectionService } from "./service";

export async function fetchGiftsCollection(this: GiftCollectionService) {
    const giftCollections =
        await this.giftCollectionRepo.fetchGiftsCollection();

    return giftCollections;
}

export async function fetchGiftCollection(
    this: GiftCollectionService,
    input: FetchGiftCollectionIn
) {
    const giftCollection =
        await this.giftCollectionRepo.fetchGiftCollection(input);

    return giftCollection;
}

export async function fetchGiftCollections(this: GiftCollectionService) {
    const giftCollections =
        await this.giftCollectionRepo.fetchGiftCollections();

    return giftCollections;
}
