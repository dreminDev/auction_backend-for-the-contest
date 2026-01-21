import type { GiftOwnerRepo } from "../../repo/gift_owner/mongo/repo";
import { createGiftOwner } from "./create";
import { fetchGiftOwner } from "./fetch";

export class GiftOwnerService {
    protected giftOwnerRepo: GiftOwnerRepo;

    constructor(giftOwnerRepo: GiftOwnerRepo) {
        this.giftOwnerRepo = giftOwnerRepo;
    }

    createGiftOwner = createGiftOwner;
    fetchGiftOwner = fetchGiftOwner;
}

