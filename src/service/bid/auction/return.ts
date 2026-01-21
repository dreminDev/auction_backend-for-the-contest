import type { AuctionBet } from "@prisma/client";

import decimal from "../../../../pkg/decimal";
import { time } from "../../../../pkg/time";
import type { TxClient } from "../../../repo/utils/tx";
import type { AuctionBidService } from "./service";

export type ReturnBetsBalanceIn = {
    bets: AuctionBet[];
    tx?: TxClient;
};

export async function returnBetsBalance(
    this: AuctionBidService,
    input: ReturnBetsBalanceIn
) {
    if (input.bets.length === 0) {
        return [];
    }

    const balanceUpdates = new Map<
        string,
        {
            balanceId: string;
            userId: number;
            amount: number;
            balanceType: string;
        }
    >();

    for (const bet of input.bets) {
        const metaData = bet.metaData as any;
        const balanceType = metaData?.balanceType ?? "stars";

        const userBalance =
            await this.balanceService.fetchBalanceByIdAndType({
                userId: bet.userId,
                type: balanceType as any,
            });

        if (!userBalance) {
            continue;
        }

        const key = `${userBalance.id}`;
        if (balanceUpdates.has(key)) {
            const existing = balanceUpdates.get(key)!;
            existing.amount += bet.amount;
        } else {
            balanceUpdates.set(key, {
                balanceId: userBalance.id,
                userId: bet.userId,
                amount: bet.amount,
                balanceType,
            });
        }
    }

    const balanceRepo = input.tx
        ? this.balanceRepo.withTx(input.tx)
        : this.balanceRepo;
    const actionRepo = input.tx
        ? this.actionRepo.withTx(input.tx)
        : this.actionRepo;

    const updatedBalances = [];
    const now = time.now();

    for (const update of balanceUpdates.values()) {
        const currentBalance =
            await this.balanceService.fetchBalanceByIdAndType({
                userId: update.userId,
                type: update.balanceType as any,
            });

        if (!currentBalance) {
            continue;
        }

        const newBalance = new decimal(currentBalance.balance)
            .add(update.amount)
            .toNumber();

        const updatedBalance = await balanceRepo.updateBalance(
            {
                id: currentBalance.id,
                balance: newBalance,
            },
            input.tx
        );

        const userBets = input.bets.filter(
            (bet) => bet.userId === update.userId
        );
        for (const bet of userBets) {
            await actionRepo.createAction(
                {
                    userId: update.userId,
                    action: "balance",
                    metaData: {
                        auctionId: bet.auctionId,
                        amount: bet.amount,
                        balanceType: update.balanceType,
                        oldBalance: currentBalance.balance,
                        newBalance: newBalance,
                        reason: "bet_return",
                    },
                    addedAt: now,
                },
                input.tx
            );
        }

        updatedBalances.push(updatedBalance);
    }

    return updatedBalances;
}
