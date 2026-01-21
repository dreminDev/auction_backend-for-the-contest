import { getTxClient, type TxClient } from "../../utils/tx";
import type {
    FetchAuctionIn,
    FetchAuctionListByStatusIn,
} from "../dto/fetch";
import type { AuctionRepo } from "./repo";

export async function fetchAuction(
    this: AuctionRepo,
    input: FetchAuctionIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const auction = await client.auction.findFirst({
        where: input,
    });

    return auction;
}

export async function fetchAuctionListByStatus(
    this: AuctionRepo,
    input: FetchAuctionListByStatusIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const auctionList = await client.auction.findMany({
        where: {
            status: input,
        },
    });

    return auctionList;
}
