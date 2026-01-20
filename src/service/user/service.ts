import type { BalanceRepo } from "../../repo/balance/mongo/repo";
import type { UserRepo } from "../../repo/user/mongo/repo";
import { registerUser } from "./register";

export class UserService {
    protected userRepo: UserRepo;
    protected balanceRepo: BalanceRepo;

    constructor(userRepo: UserRepo, balanceRepo: BalanceRepo) {
        this.userRepo = userRepo;
        this.balanceRepo = balanceRepo;
    }

    registerUser = registerUser;
}
