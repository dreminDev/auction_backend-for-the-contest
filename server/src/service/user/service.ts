import type { PrismaClient } from "@prisma/client";

import type { BalanceRepo } from "../../repo/balance/mongo/repo";
import type { UserRepo } from "../../repo/user/mongo/repo";
import type { ActionService } from "../action/service";
import type { BalanceService } from "../balance/service";
import { fetchUserById } from "./fetch";
import { registerUser } from "./register";

export class UserService {
    protected db: PrismaClient;
    protected userRepo: UserRepo;
    protected balanceRepo: BalanceRepo;
    protected balanceService: BalanceService;
    protected actionService: ActionService;

    constructor(
        db: PrismaClient,
        userRepo: UserRepo,
        balanceRepo: BalanceRepo,
        balanceService: BalanceService,
        actionService: ActionService
    ) {
        this.db = db;
        this.userRepo = userRepo;
        this.balanceRepo = balanceRepo;
        this.balanceService = balanceService;
        this.actionService = actionService;
    }

    registerUser = registerUser;
    fetchUserById = fetchUserById;
}
