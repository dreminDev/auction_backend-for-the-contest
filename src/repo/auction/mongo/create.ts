import { getTxClient, type TxClient } from "../../utils/tx";
import type { CreateAuctionIn } from "../dto/create";
import type { AuctionRepo } from "./repo";

export async function createAuction(
    this: AuctionRepo,
    input: CreateAuctionIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);
    
    const newAuction = await client.auction.create({
        data: input,
    });

    return newAuction;
}
