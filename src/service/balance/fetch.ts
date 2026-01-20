import type { FetchBalanceIn, FetchBalancesByUserIdIn } from "../../repo/balance/dto/fetch";
import type { BalanceService } from "./service";

export async function fetchBalanceByIdAndType(this: BalanceService, input: FetchBalanceIn) {
    const balance = this.balanceRepo.fetchBalanceByIdAndType(input);

    return balance;
}

export async function fetchBalancesByUserId(this: BalanceService, input: FetchBalancesByUserIdIn) {
    const balances = this.balanceRepo.fetchBalancesByUserId(input);

    return balances;
}