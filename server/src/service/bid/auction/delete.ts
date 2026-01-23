import type { AuctionBet } from "@prisma/client";

import type { AuctionBidService } from "./service";

export type DeleteBetsIn = {
    bets: AuctionBet[];
};

export async function deleteBets(this: AuctionBidService, input: DeleteBetsIn) {
    if (input.bets.length === 0) {
        return;
    }

    const tx = this.tx;
    const betRepo = tx ? this.actionBetRepo.withTx(tx) : this.actionBetRepo;

    await betRepo.deleteManyAuctionBets({
        ids: input.bets.map((bet) => bet.id),
    });
}
