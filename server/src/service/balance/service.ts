import type { BalanceRepo } from "../../repo/balance/mongo/repo";
import { addBalance } from "./add";
import { fetchBalanceByIdAndType, fetchBalancesByUserId } from "./fetch";

export class BalanceService {
    protected balanceRepo: BalanceRepo;

    constructor(balanceRepo: BalanceRepo) {
        this.balanceRepo = balanceRepo;
    }

    fetchBalanceByIdAndType = fetchBalanceByIdAndType;
    fetchBalancesByUserId = fetchBalancesByUserId;
    addBalance = addBalance;
}
