export type UpdateAuctionIn = {
    id: string;
    roundEndTime?: Date | null;
    currentRound?: number;
    roundStartTime?: Date | null;
    status?: "active" | "ended";
    endedAt?: Date;
};
