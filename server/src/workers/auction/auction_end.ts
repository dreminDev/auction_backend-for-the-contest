import { time } from "../../../pkg/time";
import { splitSupplyByRounds } from "../../utils/auction/suplyByRound";
import type { AuctionWorker } from "./worker";

export async function auctionEnd(this: AuctionWorker) {
    const release = await this.mutex.acquire();

    try {
        const auctions = await this.auctionService.fetchAuctionListByStatus("active");
        if (auctions.length === 0) {
            return;
        }

        const maxRetries = 5;
        let retries = 0;

        while (retries < maxRetries) {
            try {
                await this.db.$transaction(
                    async (tx) => {
                        for (const auction of auctions) {
                            const endAunction = time.diff(auction.roundEndTime, time.now());
                            if (endAunction > 0) {
                                continue;
                            }

                            // Получаем ставки текущего раунда
                            const betsList =
                                await this.auctionBidService.fetchActionBetListByAuctionId({
                                    auctionId: auction.id,
                                    round: auction.currentRound,
                                });

                            const supplyByRound = splitSupplyByRounds({
                                totalSupply: auction.supplyCount,
                                rounds: auction.roundCount,
                                currentRound: auction.currentRound,
                            });
                            // временно убрал для тестов.
                            if (betsList.length === 0 || supplyByRound > betsList.length) {
                                await this.auctionService.withTx(tx).updateAuction({
                                    id: auction.id,
                                    roundEndTime: time.add(
                                        new Date(auction.roundEndTime),
                                        time.minute(5)
                                    ),
                                });
                                continue;
                            }

                            const sortedBets = [...betsList].sort((a, b) => b.amount - a.amount);
                            const winners = sortedBets.slice(0, supplyByRound);
                            const losers = sortedBets.slice(supplyByRound);

                            // Выигравшие ставки получают подарки и удаляются, чтобы не переходить в следующий раунд
                            // Пользователи могут делать новые ставки в следующих раундах, но их выигравшая ставка удаляется
                            if (winners.length > 0) {
                                await this.giftOwnerService.withTx(tx).createGiftOwnerUnique(
                                    winners.map((bet) => ({
                                        giftCollectionId: auction.giftCollectionId,
                                        userId: bet.userId,
                                    }))
                                );

                                await tx.auctionBet.deleteMany({
                                    where: {
                                        id: {
                                            in: winners.map((bet) => bet.id),
                                        },
                                    },
                                });
                            }

                            // Обрабатываем проигравшие ставки - они переходят в следующий раунд
                            if (losers.length > 0) {
                                const nextRound = auction.currentRound + 1;
                                const hasNextRound = nextRound <= auction.roundCount;

                                if (hasNextRound) {
                                    // Переводим ставки в следующий раунд
                                    await this.auctionBidService.withTx(tx).updateBetsToNextRound({
                                        bets: losers,
                                        nextRound: nextRound,
                                    });

                                    // Обновляем аукцион для следующего раунда
                                    const nextRoundStartTime = time.now();
                                    await this.auctionService.withTx(tx).updateAuction({
                                        id: auction.id,
                                        currentRound: nextRound,
                                        roundStartTime: nextRoundStartTime,
                                        roundEndTime: time.add(
                                            nextRoundStartTime,
                                            auction.roundDuration
                                        ),
                                    });
                                } else {
                                    // Возвращаем баланс, так как это последний раунд
                                    await this.auctionBidService.withTx(tx).returnBetsBalance({
                                        bets: losers,
                                    });

                                    // Удаляем вернувшиеся ставки после возврата баланса
                                    await this.auctionBidService.withTx(tx).deleteBets({
                                        bets: losers,
                                    });

                                    await this.auctionService.withTx(tx).updateAuction({
                                        id: auction.id,
                                        status: "ended",
                                        endedAt: time.now(),
                                    });
                                }
                            } else {
                                const nextRound = auction.currentRound + 1;
                                if (nextRound <= auction.roundCount) {
                                    const nextRoundStartTime = time.now();
                                    await this.auctionService.withTx(tx).updateAuction({
                                        id: auction.id,
                                        currentRound: nextRound,
                                        roundStartTime: nextRoundStartTime,
                                        roundEndTime: time.add(
                                            nextRoundStartTime,
                                            auction.roundDuration
                                        ),
                                    });
                                } else {
                                    await this.auctionService.withTx(tx).updateAuction({
                                        id: auction.id,
                                        status: "ended",
                                        endedAt: time.now(),
                                    });
                                }
                            }
                        }
                    },
                    {
                        maxWait: 30_000,
                        timeout: 120_000,
                    }
                );
                break;
            } catch (error: any) {
                if (error?.code === "P2034" && retries < maxRetries - 1) {
                    retries++;
                    const delay = Math.min(100 * Math.pow(2, retries), 1000);
                    console.log(
                        `Transaction conflict detected, retrying (${retries}/${maxRetries}) after ${delay}ms`
                    );
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                throw error;
            }
        }
    } finally {
        release();
    }
}
