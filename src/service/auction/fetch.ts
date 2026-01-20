import type { AuctionService } from "./service";
import type {
    FetchAuctionIn,
    FetchAuctionListByStatusIn,
} from "../../repo/auction/dto/fetch";

export async function fetchAuction(
    this: AuctionService,
    input: FetchAuctionIn
) {
    const auction = await this.auctionRepo.fetchAuction(input);

    if (!auction) {
        throw new Error("Auction not found");
    }

    return auction;
}

export async function fetchAuctionListByStatus(
    this: AuctionService,
    input: FetchAuctionListByStatusIn
) {
    const auctionList =
        await this.auctionRepo.fetchAuctionListByStatus(input);

    if (auctionList.length === 0) {
        return [];
    }

    return auctionList;
}
