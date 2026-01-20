import type { FetchAuctionBetIn } from "../dto/fetch";
import type { ActionBetRepo } from "./repo";

export async function fetchAuctionBets(
    this: ActionBetRepo,
    input: FetchAuctionBetIn
) {
    const auctionBets = await this.db.auctionBet.findMany({
        where: { auctionId: input.auctionId },
        orderBy: {
            amount: "desc",
        },
        take: input.limit,
        skip: input.offset,
    });

    return auctionBets;
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
