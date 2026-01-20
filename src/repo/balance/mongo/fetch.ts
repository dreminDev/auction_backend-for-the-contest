import type { FetchBalanceIn } from "../dto/fetch";
import type { BalanceRepo } from "./repo";

export async function fetchBalance(this: BalanceRepo, input: FetchBalanceIn) {
    const balance = await this.db.balance.findFirst({
        where: {
            userId: input.userId,
        },
    });

    return balance;
}
