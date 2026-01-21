import type { FastifyInstance } from "fastify";

import type { BalanceService } from "../../../../service/balance/service";
import type { UserService } from "../../../../service/user/service";
import { addBalance } from "./add_balance";
import { fetchByUser } from "./fetch";

export const httpUserPrefix = "/user";
export class HttpUserController {
    protected app: FastifyInstance;
    protected userService: UserService;
    protected balanceService: BalanceService;

    constructor(app: FastifyInstance, userService: UserService, balanceService: BalanceService) {
        this.app = app;
        this.userService = userService;
        this.balanceService = balanceService;
    }

    fetchByUser = fetchByUser;
    addBalance = addBalance;

    async setup() {
        await this.app.register(
            async (fastify) => {
                fastify.get("/", async (req, res) => this.fetchByUser(req, res));
                fastify.post("/balance", async (req, res) => this.addBalance(req, res));
            },
            { prefix: httpUserPrefix }
        );
    }
}
