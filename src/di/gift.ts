import { DI } from ".";
import { GiftCollectionRepo } from "../repo/gift_collection/mongo/repo";
import { GiftOwnerRepo } from "../repo/gift_owner/mongo/repo";

export function giftOwnerRepo(this: DI) {
    const giftOwnerRepo = new GiftOwnerRepo(this.Database());

    return this.set("giftOwnerRepo", giftOwnerRepo);
}

export function giftCollectionRepo(this: DI) {
    const giftCollectionRepo = new GiftCollectionRepo(this.Database());

    return this.set("giftCollectionRepo", giftCollectionRepo);
}
