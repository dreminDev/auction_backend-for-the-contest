import type { AuctionStatus, BalanceType } from "@prisma/client";

import decimal from "../../../../pkg/decimal";
import { time } from "../../../../pkg/time";
import type { NewBetIn } from "./dto/bet";
import type { AuctionBidService } from "./service";

export async function newBet(this: AuctionBidService, input: NewBetIn) {
    const [auction, userInfoBalance] = await Promise.all([
        this.auctionService.fetchAuction({
            id: input.auctionId,
        }),
        this.balanceService.fetchBalanceByIdAndType({
            userId: input.userId,
            type: input.balanceType,
        }),
    ]);

    if (!auction) {
        throw new Error("Auction not found");
    }
    if (auction.status !== "active") {
        if (auction.status === "ended") {
            throw new Error("Auction is ended");
        }

        throw new Error("Auction is not active");
    }

    if (!userInfoBalance) {
        throw new Error("Balance not found");
    }
    if (userInfoBalance.balance < input.amount) {
        throw new Error("Insufficient balance");
    }

    const now = time.now();
    const timeUntilEnd = time.diff(auction.roundEndTime, now);
    const tenSecondsInMs = time.second(10);
    // Если время истекло, отказываем в ставке, аукцион завершается
    if (timeUntilEnd <= 0) {
        throw new Error("Auction round time has expired");
    }

    // Если осталось менее 10 секунд до конца раунда, продлеваем на 10 секунд от текущего момента
    let newRoundEndTime = auction.roundEndTime;
    if (timeUntilEnd < tenSecondsInMs) {
        newRoundEndTime = time.addNow(time.second(10));
    }

    const newBalance = new decimal(userInfoBalance.balance)
        .sub(input.amount)
        .toNumber();

    await this.balanceRepo.db.$transaction(async (tx) => {
        await tx.balance.update({
            where: {
                id: userInfoBalance.id,
            },
            data: {
                balance: newBalance,
            },
        });

        await tx.auction.update({
            where: {
                id: auction.id,
            },
            data: {
                roundEndTime: newRoundEndTime,
            },
        });

        await tx.auctionBet.create({
            data: {
                auctionId: auction.id,
                amount: input.amount,
                userId: input.userId,
                addedAt: time.now(),
                metaData: {
                    balanceType: input.balanceType,
                    oldBalance: userInfoBalance.balance,
                    newBalance: newBalance,
                },
            },
        });

        await tx.action.create({
            data: {
                userId: input.userId,
                action: "bet",
                metaData: {
                    auctionId: auction.id,
                    amount: input.amount,
                    balanceType: input.balanceType,
                    oldBalance: userInfoBalance.balance,
                    newBalance: newBalance,
                },
                addedAt: now,
            },
        });
    });
}
