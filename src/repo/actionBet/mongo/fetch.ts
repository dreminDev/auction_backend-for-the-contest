import type { FetchAuctionBetIn } from "../dto/fetch";
import type { ActionBetRepo } from "./repo";

export async function fetchAuctionBet(
    this: ActionBetRepo,
    input: FetchAuctionBetIn
) {
    const auctionBet = await this.db.auctionBet.findFirst({
        where: input,
    });

    return auctionBet;
}

export async function fetchAuctionLastBetByAuctionId(
    this: ActionBetRepo,
    auctionId: string
) {
    const auctionLastBet = await this.db.auctionBet.findFirst({
        where: { auctionId: auctionId },
        orderBy: { addedAt: "desc" },
    });

    return auctionLastBet;
}
