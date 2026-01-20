import type { AuctionRepo } from "./repo";

import type {
    FetchAuctionIn,
    FetchAuctionListByStatusIn,
} from "../dto/fetch";

export async function fetchAuction(
    this: AuctionRepo,
    input: FetchAuctionIn
) {
    const auction = await this.db.auction.findFirst({
        where: input,
    });

    return auction;
}

export async function fetchAuctionListByStatus(
    this: AuctionRepo,
    input: FetchAuctionListByStatusIn
) {
    const auctionList = await this.db.auction.findMany({
        where: {
            status: input,
        },
    });

    return auctionList;
}
