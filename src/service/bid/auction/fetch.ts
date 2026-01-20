import type { FetchAuctionBetIn } from "../../../repo/actionBet/dto/fetch";
import type { AuctionBidService } from "./service";

export async function fetchAuctionLastBetByAuctionId(
    this: AuctionBidService,
    auctionId: string
) {
    const auctionLastBet =
        await this.actionBetRepo.fetchAuctionLastBetByAuctionId(auctionId);

    if (!auctionLastBet) {
        return null;
    }

    return auctionLastBet;
}

export async function fetchActionBetListByAuctionId(
    this: AuctionBidService,
    input: FetchAuctionBetIn
) {
    if (input.limit <= 0) {
        input.limit = 10;
    }

    const actionBetList = await this.actionBetRepo.fetchAuctionBets({
        auctionId: input.auctionId,
        limit: input.limit,
        offset: input.offset,
    });

    return actionBetList;
}

export async function fetchAuctionById(
    this: AuctionBidService,
    input: FetchAuctionBetIn
) {
    const [auction, actionBetList] = await Promise.all([
        this.auctionService.fetchAuction({
            id: input.auctionId,
        }),
        this.fetchActionBetListByAuctionId(input),
    ]);

    if (!auction) {
        throw new Error("Auction not found");
    }

    actionBetList.forEach((bet: Record<string, any>) => {
        delete bet.auctionId;
        delete bet.addedAt
        delete bet.metaData;
    });

    return {
        auction,
        actionBetList,
    };
}
