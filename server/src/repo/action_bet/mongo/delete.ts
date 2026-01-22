import { getTxClient, type TxClient } from "../../utils/tx";
import type { DeleteManyAuctionBetsIn } from "../dto/delete";
import type { ActionBetRepo } from "./repo";

export async function deleteManyAuctionBets(
    this: ActionBetRepo,
    input: DeleteManyAuctionBetsIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    await client.auctionBet.deleteMany({
        where: {
            id: {
                in: input.ids,
            },
        },
    });
}
