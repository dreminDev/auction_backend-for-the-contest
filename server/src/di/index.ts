import { logger } from "../../pkg/logger";
import { config } from "../config";
import { actionRepo, actionService } from "./action";
import {
    actionBetRepo,
    auctionBidService,
    auctionRepo,
    auctionService,
    auctionWorker,
    httpAuctionController,
} from "./auction";
import { balanceRepo, balanceService } from "./balance";
import { database } from "./database";
import {
    giftCollectionRepo,
    giftCollectionService,
    giftOwnerRepo,
    giftOwnerService,
    httpGiftsController,
} from "./gift";
import { httpServer } from "./server";
import { httpMiddleware, httpUserController, userRepo, userService } from "./user";

export class DI {
    protected injections: Map<String, unknown> = new Map();

    readonly logger = logger;
    readonly config = config;

    readonly Database = database;
    readonly HttpServer = httpServer;

    readonly HttpUserController = httpUserController;
    readonly HttpMiddleware = httpMiddleware;
    readonly UserRepo = userRepo;
    readonly UserService = userService;

    readonly BalanceRepo = balanceRepo;
    readonly BalanceService = balanceService;

    readonly HttpAuctionController = httpAuctionController;
    readonly AuctionRepo = auctionRepo;
    readonly ActionBetRepo = actionBetRepo;
    readonly AuctionService = auctionService;
    readonly AuctionBidService = auctionBidService;
    readonly AuctionWorker = auctionWorker;

    readonly HttpGiftsController = httpGiftsController;
    readonly GiftOwnerRepo = giftOwnerRepo;
    readonly GiftCollectionRepo = giftCollectionRepo;
    readonly GiftOwnerService = giftOwnerService;
    readonly GiftCollectionService = giftCollectionService;

    readonly ActionRepo = actionRepo;
    readonly ActionService = actionService;

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
