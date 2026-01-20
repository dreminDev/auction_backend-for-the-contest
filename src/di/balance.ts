import type { DI } from ".";
import { BalanceRepo } from "../repo/balance/mongo/repo";
import { BalanceService } from "../service/balance/service";

export function balanceRepo(this: DI) {
    const balanceRepo = new BalanceRepo(this.Database());

    return this.set("balanceRepo", balanceRepo);
}

export function balanceService(this: DI) {
    const balanceService = new BalanceService(
        this.BalanceRepo()
    );

    return this.set("balanceService", balanceService);
}
