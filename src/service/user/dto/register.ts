import type { Balance, User } from "@prisma/client";

export type RegisterUserOut = {
    isNewUser: boolean;
    user: User | null;
    balance: Balance | null;
};
