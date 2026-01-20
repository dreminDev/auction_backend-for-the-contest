import type { BalanceType } from "@prisma/client";

export type FetchBalanceIn = {
    userId: number;
    type: BalanceType;
};

export type FetchBalancesByUserIdIn = {
    userId: number;
};
