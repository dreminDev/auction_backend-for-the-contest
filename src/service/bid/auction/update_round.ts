import type { AuctionBet } from "@prisma/client";

import type { TxClient } from "../../../repo/utils/tx";
import type { AuctionBidService } from "./service";

export type UpdateBetsToNextRoundIn = {
    bets: AuctionBet[];
    nextRound: number;
    tx?: TxClient;
};

export async function updateBetsToNextRound(
    this: AuctionBidService,
    input: UpdateBetsToNextRoundIn
) {
    if (input.bets.length === 0) {
        return [];
    }

    const betRepo = input.tx
        ? this.actionBetRepo.withTx(input.tx)
        : this.actionBetRepo;

    const updatedBets = await betRepo.updateManyAuctionBets(
        {
            ids: input.bets.map((bet) => bet.id),
            round: input.nextRound,
        },
        input.tx
    );

    return updatedBets;
}
