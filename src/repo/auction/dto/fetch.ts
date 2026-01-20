import type { AuctionStatus, Prisma } from "@prisma/client";

export type FetchAuctionIn = Prisma.AuctionWhereInput;

export type FetchAuctionListByStatusIn = AuctionStatus;
