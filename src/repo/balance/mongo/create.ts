import type { BalanceRepo } from "./repo";
import type { CreateBalanceIn } from "../dto/create";

export async function createBalance(this: BalanceRepo, input: CreateBalanceIn) {
    const newBalance = await this.db.balance.create({
        data: input,
    });

    return newBalance;
}
