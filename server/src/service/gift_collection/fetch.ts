import type { FetchGiftCollectionIn } from "../../repo/gift_collection/dto/fetch";
import type { GiftCollectionService } from "./service";

export async function fetchGiftsCollection(this: GiftCollectionService) {
    const giftCollections = await this.giftCollectionRepo.fetchGiftsCollection();

    return giftCollections;
}

export async function fetchGiftCollection(
    this: GiftCollectionService,
    input: FetchGiftCollectionIn
) {
    const giftCollection = await this.giftCollectionRepo.fetchGiftCollection(input);

    return giftCollection;
}

export async function fetchGiftCollections(this: GiftCollectionService) {
    const giftCollections = await this.giftCollectionRepo.fetchGiftCollections();

    return giftCollections;
}

export async function fetchGiftCollectionsWithAvailable(this: GiftCollectionService) {
    const giftCollections = await this.giftCollectionRepo.fetchGiftCollections();

    if (!this.giftOwnerRepo) {
        return giftCollections.map((c) => ({ ...c, availableCount: c.supplyCount }));
    }

    const collectionsWithAvailable = await Promise.all(
        giftCollections.map(async (collection) => {
            const issuedCount = await this.giftOwnerRepo!.countGiftOwnersByGiftId({
                giftId: collection.id,
            });
            return {
                ...collection,
                availableCount: collection.supplyCount - issuedCount,
            };
        })
    );

    return collectionsWithAvailable;
}
