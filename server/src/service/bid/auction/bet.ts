import decimal from "../../../../pkg/decimal";
import { time } from "../../../../pkg/time";
import { BadRequestError, NotFoundError, PaymentRequiredError } from "../../../error/customError";
import type { NewBetIn } from "./dto/bet";
import type { AuctionBidService } from "./service";

export async function newBet(this: AuctionBidService, input: NewBetIn) {
    const [auction, userInfoBalance, userBets] = await Promise.all([
        this.auctionService.fetchAuction({
            id: input.auctionId,
        }),
        this.balanceService.fetchBalanceByIdAndType({
            userId: input.userId,
            type: input.balanceType,
        }),
        this.fetchUserBetsByAuctionIdAndUserId({
            auctionId: input.auctionId,
            userId: input.userId,
        }),
    ]);

    if (!auction) {
        throw new NotFoundError("auction not found");
    }
    if (auction.status !== "active") {
        if (auction.status === "ended") {
            throw new BadRequestError("auction is ended");
        }

        throw new BadRequestError("auction is not active");
    }

    if (!userInfoBalance) {
        throw new NotFoundError("balance not found");
    }
    if (userInfoBalance.balance < input.amount) {
        throw new PaymentRequiredError("insufficient balance");
    }

    const now = time.now();
    const timeUntilEnd = time.diff(auction.roundEndTime, now);
    const tenSecondsInMs = time.second(10);
    // Если время истекло, отказываем в ставке, аукцион завершается
    if (timeUntilEnd <= 0) {
        throw new BadRequestError("auction round time has expired");
    }

    // Если осталось менее 10 секунд до конца раунда, продлеваем на 10 секунд от текущего момента
    let newRoundEndTime = auction.roundEndTime;
    if (timeUntilEnd < tenSecondsInMs) {
        newRoundEndTime = time.addNow(time.second(10));
    }

    const newBalance = new decimal(userInfoBalance.balance).sub(input.amount).toNumber();

    await this.db.$transaction(async (tx) => {
        await this.balanceRepo.withTx(tx).updateBalance({
            id: userInfoBalance.id,
            balance: newBalance,
        });

        await this.auctionRepo.withTx(tx).updateAuction({
            id: auction.id,
            roundEndTime: newRoundEndTime,
        });

        if (userBets) {
            const newBetAmount = input.amount + userBets.amount;
            const oldBalance = new decimal((userBets.metaData as any).oldBalance).toNumber();

            await this.actionBetRepo.withTx(tx).updateAuctionBet({
                id: userBets.id,
                amount: newBetAmount,
                round: auction.currentRound,
                metaData: {
                    oldBalance: oldBalance,
                    newBalance: newBalance,
                    balanceType: input.balanceType,
                },
            });
        } else {
            await this.actionBetRepo.withTx(tx).createAuctionBet({
                auctionId: auction.id,
                amount: input.amount,
                userId: input.userId,
                round: auction.currentRound,
                addedAt: time.now(),
                metaData: {
                    oldBalance: userInfoBalance.balance,
                    newBalance: newBalance,
                    balanceType: input.balanceType,
                },
            });
        }

        await this.actionRepo.withTx(tx).createAction({
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
        });
    });
}
