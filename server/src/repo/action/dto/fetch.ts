export type FetchWinnersByAuctionIdIn = {
    auctionId: string;
};

export type Winner = {
    userId: number;
    round: number;
    amount: number;
    place: number;
    addedAt: Date;
};
