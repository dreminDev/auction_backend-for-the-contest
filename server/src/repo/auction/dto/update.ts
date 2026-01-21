export type UpdateAuctionIn = {
    id: string;
    roundEndTime?: Date;
    currentRound?: number;
    roundStartTime?: Date;
    status?: "active" | "ended";
    endedAt?: Date;
};
