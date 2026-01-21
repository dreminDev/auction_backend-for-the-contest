import type { User } from "@prisma/client";

export type FetchUserIn = {
    userId: number;
};

export type FetchUserOut = User | null;
