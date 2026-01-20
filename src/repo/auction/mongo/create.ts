import type { AuctionRepo } from "./repo";

import type { CreateAuctionIn } from "../dto/create";

export async function createAuction(
    this: AuctionRepo,
    input: CreateAuctionIn
) {
    const newAuction = await this.db.auction.create({
        data: input,
    });

    return newAuction;
}
