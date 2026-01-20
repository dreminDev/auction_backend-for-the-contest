import type { User, Balance } from "@prisma/client";

export type RegisterUserIn = {
    userId: number;
};

export type RegisterUserOut = {
    isNewUser: boolean;
    user: User | null;
    balance: Balance | null;
};
