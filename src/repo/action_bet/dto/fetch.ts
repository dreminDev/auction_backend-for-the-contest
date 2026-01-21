export type FetchAuctionBetIn = {
    auctionId: string;
    limit?: number;
    offset?: number;
    round?: number;
};

export type FetchUserBetsByAuctionIdAndUserIdIn = {
    auctionId: string;
    userId: number;
};
