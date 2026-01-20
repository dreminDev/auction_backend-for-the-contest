import type { FetchBalanceIn, FetchBalancesByUserIdIn } from "../dto/fetch";
import type { BalanceRepo } from "./repo";

export async function fetchBalanceByIdAndType(
    this: BalanceRepo,
    input: FetchBalanceIn
) {
    const balance = await this.db.balance.findFirst({
        where: {
            userId: input.userId,
            type: input.type,
        },
    });

    return balance;
}

export async function fetchBalancesByUserId(this: BalanceRepo, input: FetchBalancesByUserIdIn) {
    const balances = await this.db.balance.findMany({
        where: {
            userId: input.userId,
        },
    });

    return balances;
}