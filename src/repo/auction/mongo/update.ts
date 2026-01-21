import { getTxClient, type TxClient } from "../../utils/tx";
import type { UpdateAuctionIn } from "../dto/update";
import type { AuctionRepo } from "./repo";

export async function updateAuction(this: AuctionRepo, input: UpdateAuctionIn, tx?: TxClient) {
    const client = getTxClient(this.db, tx);

    const updatedAuction = await client.auction.update({
        where: {
            id: input.id,
        },
        data: {
            roundEndTime: input.roundEndTime,
        },
    });

    return updatedAuction;
}
