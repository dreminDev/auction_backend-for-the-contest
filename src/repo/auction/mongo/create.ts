import type { CreateAuctionIn } from "../dto/create";
import type { AuctionRepo } from "./repo";

export async function createAuction(
    this: AuctionRepo,
    input: CreateAuctionIn
) {
    const newAuction = await this.db.auction.create({
        data: input,
    });

    return newAuction;
}
