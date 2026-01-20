import { getTxClient, type TxClient } from "../../utils/tx";
import type { FetchAuctionBetIn } from "../dto/fetch";
import type { ActionBetRepo } from "./repo";

export async function fetchAuctionBets(
    this: ActionBetRepo,
    input: FetchAuctionBetIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);
    
    const auctionBets = await client.auctionBet.findMany({
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
    auctionId: string,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);
    
    const auctionLastBet = await client.auctionBet.findFirst({
        where: { auctionId: auctionId },
        orderBy: { addedAt: "desc" },
    });

    return auctionLastBet;
}
