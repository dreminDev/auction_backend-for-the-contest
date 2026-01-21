import { getTxClient, type TxClient } from "../../utils/tx";
import type { CreateAuctionBetIn } from "../dto/create";
import type { ActionBetRepo } from "./repo";

export async function createAuctionBet(
    this: ActionBetRepo,
    input: CreateAuctionBetIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const newAuctionBet = await client.auctionBet.create({
        data: input,
    });

    return newAuctionBet;
}
