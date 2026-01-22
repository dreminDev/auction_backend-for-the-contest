import { BadRequestError, NotFoundError, OutOfStockError } from "../../error/customError";
import type { CreateAuctionIn } from "../../repo/auction/dto/create";
import type { AuctionService } from "./service";

export async function createAuction(this: AuctionService, input: CreateAuctionIn) {
    const giftCollection = await this.giftCollectionService.fetchGiftCollection({
        id: input.giftCollectionId,
    });

    if (!giftCollection) {
        throw new NotFoundError("Gift collection not found");
    }

    // supplyCount не может быть больше чем supplyCount коллекции
    if (input.supplyCount > giftCollection.supplyCount) {
        throw new BadRequestError(
            `supplyCount (${input.supplyCount}) cannot be greater than collection supplyCount (${giftCollection.supplyCount})`
        );
    }

    // учитываем уже выданные подарки из коллекции
    if (this.giftOwnerService) {
        const issuedGiftsCount = await this.giftOwnerService.countGiftOwnersByGiftId({
            giftId: input.giftCollectionId,
        });

        const availableGifts = giftCollection.supplyCount - issuedGiftsCount;

        if (availableGifts <= 0) {
            throw new OutOfStockError("Gift collection is out of stock");
        }

        if (input.supplyCount > availableGifts) {
            throw new BadRequestError(
                `supplyCount (${input.supplyCount}) cannot be greater than available gifts count (${availableGifts}). Already issued: ${issuedGiftsCount}, total in collection: ${giftCollection.supplyCount}`
            );
        }
    }

    const newAuction = await this.auctionRepo.createAuction(input);

    if (!newAuction) {
        throw new Error("Failed to create auction");
    }

    return newAuction;
}
