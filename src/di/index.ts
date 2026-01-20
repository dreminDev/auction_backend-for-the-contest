import { logger } from "../../pkg/logger";
import { actionRepo } from "./action";
import { balanceRepo, balanceService } from "./balance";
import { database } from "./database";
import { httpServer } from "./server";
import {
    httpUserController,
    userRepo,
    userService,
} from "./user";
export class DI {
    protected injections: Map<String, unknown> = new Map();

    readonly logger = logger;

    readonly Database = database;
    readonly HttpServer = httpServer;

    readonly HttpUserController = httpUserController;
    readonly UserRepo = userRepo;
    readonly UserService = userService;

    readonly BalanceRepo = balanceRepo;
    readonly BalanceService = balanceService;
    
    readonly ActionRepo = actionRepo;

    constructor() {
        this.injections = new Map();
    }

    private get<T = unknown>(key: string) {
        return this.injections.get(key) as T;
    }

    private has(key: string): boolean {
        return this.injections.has(key);
    }

    protected set<T = unknown>(key: string, value: T): T {
        if (this.has(key)) {
            return this.get(key) as T;
        }

        this.injections.set(key, value);

        this.logger.info(`Injected ${key} into DI`);

        return value;
    }
}
