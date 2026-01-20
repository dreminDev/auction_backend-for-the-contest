import type { Balance, User } from "@prisma/client";

export type FetchUserByIdOut = {
    user: User;
    balances: Balance[];
};