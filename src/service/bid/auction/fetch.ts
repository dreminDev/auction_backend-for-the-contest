import type {
    FetchAuctionBetIn,
    FetchUserBetsByAuctionIdAndUserIdIn,
} from "../../../repo/action_bet/dto/fetch";
import type { AuctionBidService } from "./service";

export async function fetchAuctionLastBetByAuctionId(this: AuctionBidService, auctionId: string) {
    const auctionLastBet = await this.actionBetRepo.fetchAuctionLastBetByAuctionId(auctionId);

    if (!auctionLastBet) {
        return null;
    }

    return auctionLastBet;
}

export async function fetchActionBetListByAuctionId(
    this: AuctionBidService,
    input: FetchAuctionBetIn
) {
    const actionBetList = await this.actionBetRepo.fetchAuctionBets(input);

    return actionBetList;
}

export async function fetchAuctionById(this: AuctionBidService, input: FetchAuctionBetIn) {
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
        delete bet.addedAt;
        delete bet.metaData;
    });

    return {
        auction,
        actionBetList,
    };
}

export async function fetchUserBetsByAuctionIdAndUserId(
    this: AuctionBidService,
    input: FetchUserBetsByAuctionIdAndUserIdIn
) {
    const userBets = await this.actionBetRepo.fetchUserBetsByAuctionIdAndUserId(input);

    return userBets;
}
