import type { AuctionStatus } from "@prisma/client";

export type FetchAuctionListByStatusIn = {
    status: AuctionStatus;
};
