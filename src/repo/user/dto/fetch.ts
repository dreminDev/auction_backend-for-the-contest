import type { User } from "../../../model/user";

export type FetchUserIn = {
    userId: number;
};

export type FetchUserOut = User | null;
