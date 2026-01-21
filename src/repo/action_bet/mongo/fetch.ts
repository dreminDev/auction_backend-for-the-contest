import type { Prisma } from "@prisma/client";

import { getTxClient, type TxClient } from "../../utils/tx";
import type { FetchAuctionBetIn, FetchUserBetsByAuctionIdAndUserIdIn } from "../dto/fetch";
import type { ActionBetRepo } from "./repo";

export async function fetchAuctionBets(
    this: ActionBetRepo,
    input: FetchAuctionBetIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const where: Prisma.AuctionBetWhereInput = {
        auctionId: input.auctionId,
    };

    if (input.round !== undefined) {
        where.round = input.round;
    }

    const query: Prisma.AuctionBetFindManyArgs = {
        where,
        orderBy: {
            amount: "desc",
        },
        take: input.limit,
        skip: input.offset,
    };

    if (!input.limit) {
        delete query.take;
    }
    if (!input.offset) {
        delete query.skip;
    }

    const auctionBets = await client.auctionBet.findMany(query);

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

export async function fetchUserBetsByAuctionIdAndUserId(
    this: ActionBetRepo,
    input: FetchUserBetsByAuctionIdAndUserIdIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const userBets = await client.auctionBet.findFirst({
        where: { auctionId: input.auctionId, userId: input.userId },
    });

    return userBets;
}
