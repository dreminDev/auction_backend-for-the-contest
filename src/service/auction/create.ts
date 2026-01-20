import type { AuctionService } from "./service";
import type { CreateAuctionIn } from "../../repo/auction/dto/create";

export async function createAuction(
    this: AuctionService,
    input: CreateAuctionIn
) {
    const newAuction = await this.auctionRepo.createAuction(input);

    if (!newAuction) {
        throw new Error("Failed to create auction");
    }

    return newAuction;
}
