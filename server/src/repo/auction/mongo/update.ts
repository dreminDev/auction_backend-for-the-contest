import { getTxClient, type TxClient } from "../../utils/tx";
import type { UpdateAuctionIn } from "../dto/update";
import type { AuctionRepo } from "./repo";

export async function updateAuction(this: AuctionRepo, input: UpdateAuctionIn, tx?: TxClient) {
    const client = getTxClient(this.db, tx);

    const data: Record<string, unknown> = {};
    if (input.roundEndTime !== undefined) data.roundEndTime = input.roundEndTime;
    if (input.currentRound !== undefined) data.currentRound = input.currentRound;
    if (input.roundStartTime !== undefined) data.roundStartTime = input.roundStartTime;
    if (input.status !== undefined) data.status = input.status;
    if (input.endedAt !== undefined) data.endedAt = input.endedAt;

    const updatedAuction = await client.auction.update({
        where: {
            id: input.id,
        },
        data,
    });

    return updatedAuction;
}
