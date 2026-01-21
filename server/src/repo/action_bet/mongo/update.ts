import type { Prisma } from "@prisma/client";

import { getTxClient, type TxClient } from "../../utils/tx";
import type { UpdateAuctionBetIn, UpdateManyAuctionBetsIn } from "../dto/update";
import type { ActionBetRepo } from "./repo";

export async function updateAuctionBet(
    this: ActionBetRepo,
    input: UpdateAuctionBetIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const data: Prisma.AuctionBetUpdateInput = {};

    if (input.amount !== undefined) {
        data.amount = input.amount;
    }
    if (input.round !== undefined) {
        data.round = input.round;
    }
    if (input.metaData !== undefined) {
        data.metaData = input.metaData;
    }

    const updatedAuctionBet = await client.auctionBet.update({
        where: {
            id: input.id,
        },
        data,
    });

    return updatedAuctionBet;
}

export async function updateManyAuctionBets(
    this: ActionBetRepo,
    input: UpdateManyAuctionBetsIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const data: Prisma.AuctionBetUpdateInput = {};

    if (input.round !== undefined) {
        data.round = input.round;
    }
    if (input.metaData !== undefined) {
        data.metaData = input.metaData;
    }

    const result = await client.auctionBet.updateMany({
        where: {
            id: {
                in: input.ids,
            },
        },
        data,
    });

    const updatedBets = await client.auctionBet.findMany({
        where: {
            id: {
                in: input.ids,
            },
        },
    });

    return updatedBets;
}
