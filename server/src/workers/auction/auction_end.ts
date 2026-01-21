import { time } from "../../../pkg/time";
import { splitSupplyByRounds } from "../../utils/auction/suplyByRound";
import type { AuctionWorker } from "./worker";

export async function auctionEnd(this: AuctionWorker) {
    const auctions = await this.auctionService.fetchAuctionListByStatus("active");
    if (auctions.length === 0) {
        return;
    }

    const release = await this.mutex.acquire();

    try {
        await this.db.$transaction(async (tx) => {
            for (const auction of auctions) {
                const endAunction = time.diff(auction.roundEndTime, time.now());
                console.log(`endAunction:`, endAunction);
                if (endAunction > 0) {
                    continue;
                }

                // Получаем ставки текущего раунда
                const betsList = await this.auctionBidService.fetchActionBetListByAuctionId({
                    auctionId: auction.id,
                    round: auction.currentRound,
                });
                console.log(`betsList:`, betsList);

                const supplyByRound = splitSupplyByRounds({
                    totalSupply: auction.supplyCount,
                    rounds: auction.roundCount,
                    currentRound: auction.currentRound,
                });
                // временно убрал для тестов.
                // if (
                //     betsList.length === 0 /* ||
                //     supplyByRound > betsList.length */
                // ) {
                //     // Если нет или недостаточно ставок в аукционе, то продлеваем аукцион на 5 минут.
                //     await tx.auction.update({
                //         where: { id: auction.id },
                //         data: {
                //             roundEndTime: time.add(
                //                 new Date(auction.roundStartTime),
                //                 time.minute(5)
                //             ),
                //         },
                //     });
                //     continue;
                // }

                const sortedBets = [...betsList].sort((a, b) => b.amount - a.amount);
                const winners = sortedBets.slice(0, supplyByRound);
                const losers = sortedBets.slice(supplyByRound);

                console.log(`supplyByRound:`, supplyByRound);
                console.log(`winners:`, winners);
                console.log(`losers:`, losers);

                // Выдаем подарки победителям
                if (winners.length > 0) {
                    await this.giftOwnerService.createGiftOwnerUnique(
                        winners.map((bet) => ({
                            giftCollectionId: auction.giftCollectionId,
                            userId: bet.userId,
                        })),
                        tx
                    );
                }

                // Обрабатываем проигравшие ставки
                if (losers.length > 0) {
                    const nextRound = auction.currentRound + 1;
                    const hasNextRound = nextRound <= auction.roundCount;

                    if (hasNextRound) {
                        // Переводим ставки в следующий раунд
                        await this.auctionBidService.updateBetsToNextRound(
                            {
                                bets: losers,
                                nextRound: nextRound,
                            },
                            tx
                        );

                        // Обновляем аукцион для следующего раунда
                        const nextRoundStartTime = time.now();
                        await tx.auction.update({
                            where: { id: auction.id },
                            data: {
                                currentRound: nextRound,
                                roundStartTime: nextRoundStartTime,
                                roundEndTime: time.add(nextRoundStartTime, auction.roundDuration),
                            },
                        });
                    } else {
                        // Возвращаем баланс, так как это последний раунд
                        await this.auctionBidService.returnBetsBalance(
                            {
                                bets: losers,
                            },
                            tx
                        );

                        await tx.auction.update({
                            where: { id: auction.id },
                            data: {
                                status: "ended",
                                endedAt: time.now(),
                            },
                        });
                    }
                } else {
                    const nextRound = auction.currentRound + 1;
                    if (nextRound <= auction.roundCount) {
                        const nextRoundStartTime = time.now();
                        await tx.auction.update({
                            where: { id: auction.id },
                            data: {
                                currentRound: nextRound,
                                roundStartTime: nextRoundStartTime,
                                roundEndTime: time.add(nextRoundStartTime, auction.roundDuration),
                            },
                        });
                    } else {
                        await tx.auction.update({
                            where: { id: auction.id },
                            data: {
                                status: "ended",
                                endedAt: time.now(),
                            },
                        });
                    }
                }
            }
        });
    } finally {
        release();
    }
}
