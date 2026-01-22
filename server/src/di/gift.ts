import type { DI } from ".";
import { HttpGiftsController } from "../controllers/http/handlers/gift";
import { GiftCollectionRepo } from "../repo/gift_collection/mongo/repo";
import { GiftOwnerRepo } from "../repo/gift_owner/mongo/repo";
import { GiftCollectionService } from "../service/gift_collection/service";
import { GiftOwnerService } from "../service/gift_owner/service";

export function httpGiftsController(this: DI) {
    const httpGiftsController = new HttpGiftsController(
        this.HttpServer(),
        this.GiftOwnerService(),
        this.GiftCollectionService()
    );

    return this.set("httpGiftsController", httpGiftsController);
}

export function giftOwnerRepo(this: DI) {
    const giftOwnerRepo = new GiftOwnerRepo(this.Database());

    return this.set("giftOwnerRepo", giftOwnerRepo);
}

export function giftCollectionRepo(this: DI) {
    const giftCollectionRepo = new GiftCollectionRepo(this.Database());

    return this.set("giftCollectionRepo", giftCollectionRepo);
}

export function giftOwnerService(this: DI) {
    const giftOwnerService = new GiftOwnerService(
        this.GiftOwnerRepo(),
        this.GiftCollectionService()
    );

    return this.set("giftOwnerService", giftOwnerService);
}

export function giftCollectionService(this: DI) {
    const giftCollectionService = new GiftCollectionService(
        this.GiftCollectionRepo(),
        this.GiftOwnerRepo()
    );

    return this.set("giftCollectionService", giftCollectionService);
}
