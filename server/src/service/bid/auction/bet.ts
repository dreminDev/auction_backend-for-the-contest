import decimal from "../../../../pkg/decimal";
import { time } from "../../../../pkg/time";
import { BadRequestError, NotFoundError, PaymentRequiredError } from "../../../error/customError";
import { splitSupplyByRounds } from "../../../utils/auction/suplyByRound";
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

    const currentRoundBets = await this.fetchActionBetListByAuctionId({
        auctionId: input.auctionId,
        round: auction.currentRound,
    });

    // Вычисляем количество призовых мест в текущем раунде
    const supplyByRound = splitSupplyByRounds({
        totalSupply: auction.supplyCount,
        rounds: auction.roundCount,
        currentRound: auction.currentRound,
    });

    // Вычисляем итоговую сумму ставки пользователя
    const totalBetAmount = userBets ? userBets.amount + input.amount : input.amount;

    // Проверяем, что ставка перебивающая (больше последней выигрывающей ставки)
    // Исключаем ставку пользователя из списка для корректной проверки
    const betsWithoutUser = currentRoundBets.filter((bet) => bet.userId !== input.userId);
    
    if (betsWithoutUser.length >= supplyByRound) {
        // Сортируем ставки по убыванию и берем последнюю выигрывающую ставку
        const sortedBets = [...betsWithoutUser].sort((a, b) => b.amount - a.amount);
        const lastWinningBetAmount = sortedBets[supplyByRound - 1]!.amount;

        // Ставка должна быть больше последней выигрывающей ставки
        if (totalBetAmount <= lastWinningBetAmount) {
            throw new BadRequestError(
                `bet must be higher than the last winning bet (${lastWinningBetAmount}). Your total bet: ${totalBetAmount}`
            );
        }
    }

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
