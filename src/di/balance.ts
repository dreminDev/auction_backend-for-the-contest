import type { DI } from ".";
import { BalanceRepo } from "../repo/balance/mongo/repo";

export function balanceRepo(this: DI) {
    const balanceRepo = new BalanceRepo(this.Database());

    return this.set("balanceRepo", balanceRepo);
}
