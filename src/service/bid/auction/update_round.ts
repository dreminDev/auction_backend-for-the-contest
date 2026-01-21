import type { AuctionBet } from "@prisma/client";

import type { TxClient } from "../../../repo/utils/tx";
import type { AuctionBidService } from "./service";

export type UpdateBetsToNextRoundIn = {
    bets: AuctionBet[];
    nextRound: number;
};

export async function updateBetsToNextRound(
    this: AuctionBidService,
    input: UpdateBetsToNextRoundIn,
    tx?: TxClient
) {
    if (input.bets.length === 0) {
        return [];
    }

    const betRepo = tx ? this.actionBetRepo.withTx(tx) : this.actionBetRepo;

    const updatedBets = await betRepo.updateManyAuctionBets(
        {
            ids: input.bets.map((bet) => bet.id),
            round: input.nextRound,
        },
        tx
    );

    return updatedBets;
}
