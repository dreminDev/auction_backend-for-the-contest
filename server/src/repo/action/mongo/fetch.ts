import { getTxClient, type TxClient } from "../../utils/tx";
import type { FetchWinnersByAuctionIdIn, Winner } from "../dto/fetch";
import type { ActionRepo } from "./repo";

export async function fetchWinnersByAuctionId(
    this: ActionRepo,
    input: FetchWinnersByAuctionIdIn,
    tx?: TxClient
): Promise<Winner[]> {
    const client = getTxClient(this.db, tx);

    const actions = await client.action.findMany({
        where: {
            action: "win",
        },
        orderBy: {
            addedAt: "asc",
        },
    });

    const filtered = actions.filter((action) => {
        const meta = action.metaData as Record<string, any> | null;
        return meta && meta.auctionId === input.auctionId;
    });

    filtered.sort((a, b) => {
        const metaA = a.metaData as Record<string, any>;
        const metaB = b.metaData as Record<string, any>;
        if (metaA.round !== metaB.round) {
            return metaA.round - metaB.round;
        }
        return metaA.place - metaB.place;
    });

    return filtered.map((action) => {
        const meta = action.metaData as Record<string, any>;
        return {
            userId: action.userId,
            round: meta.round,
            amount: meta.amount,
            place: meta.place,
            addedAt: action.addedAt,
        };
    });
}
