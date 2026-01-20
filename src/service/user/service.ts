import type { BalanceRepo } from "../../repo/balance/mongo/repo";
import type { UserRepo } from "../../repo/user/mongo/repo";
import type { BalanceService } from "../balance/service";
import { fetchUserById } from "./fetch";
import { registerUser } from "./register";

export class UserService {
    protected userRepo: UserRepo;
    protected balanceRepo: BalanceRepo;
    protected balanceService: BalanceService;

    constructor(
        userRepo: UserRepo,
        balanceRepo: BalanceRepo,
        balanceService: BalanceService
    ) {
        this.userRepo = userRepo;
        this.balanceRepo = balanceRepo;
        this.balanceService = balanceService;
    }

    registerUser = registerUser;
    fetchUserById = fetchUserById;
}
