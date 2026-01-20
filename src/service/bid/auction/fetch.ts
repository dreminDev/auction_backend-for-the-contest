import type { AuctionBidService } from "./service";

export async function fetchAuctionLastBetByAuctionId(
    this: AuctionBidService,
    auctionId: string
) {
    const auctionLastBet =
        await this.actionBetRepo.fetchAuctionLastBetByAuctionId(auctionId);

    if (!auctionLastBet) {
        return null;
    }

    return auctionLastBet;
}
