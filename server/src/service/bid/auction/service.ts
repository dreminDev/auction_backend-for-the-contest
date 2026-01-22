import type { PrismaClient } from "@prisma/client";

import type { ActionBetRepo } from "../../../repo/action_bet/mongo/repo";
import type { ActionRepo } from "../../../repo/action/mongo/repo";
import type { AuctionRepo } from "../../../repo/auction/mongo/repo";
import type { BalanceRepo } from "../../../repo/balance/mongo/repo";
import type { TxClient } from "../../../repo/utils/tx";
import type { ActionService } from "../../action/service";
import type { AuctionService } from "../../auction/service";
import type { BalanceService } from "../../balance/service";
import type { UserService } from "../../user/service";
import { newBet } from "./bet";
import { deleteBets } from "./delete";
import {
    fetchActionBetListByAuctionId,
    fetchAuctionById,
    fetchAuctionLastBetByAuctionId,
    fetchUserBetsByAuctionIdAndUserId,
} from "./fetch";
import { returnBetsBalance } from "./return";
import { updateBetsToNextRound } from "./update_round";

export class AuctionBidService {
    protected db: PrismaClient;
    protected userService: UserService;
    protected auctionService: AuctionService;
    protected actionBetRepo: ActionBetRepo;
    protected balanceService: BalanceService;
    protected actionService: ActionService;
    protected balanceRepo: BalanceRepo;
    protected auctionRepo: AuctionRepo;
    protected actionRepo: ActionRepo;
    protected tx?: TxClient;

    constructor(
        db: PrismaClient,
        userService: UserService,
        auctionService: AuctionService,
        balanceService: BalanceService,
        actionService: ActionService,
        balanceRepo: BalanceRepo,
        actionBetRepo: ActionBetRepo,
        auctionRepo: AuctionRepo,
        actionRepo: ActionRepo
    ) {
        this.db = db;
        this.userService = userService;
        this.auctionService = auctionService;
        this.balanceService = balanceService;
        this.actionService = actionService;
        this.balanceRepo = balanceRepo;
        this.actionBetRepo = actionBetRepo;
        this.auctionRepo = auctionRepo;
        this.actionRepo = actionRepo;
    }

    fetchAuctionLastBetByAuctionId = fetchAuctionLastBetByAuctionId;
    fetchActionBetListByAuctionId = fetchActionBetListByAuctionId;
    fetchUserBetsByAuctionIdAndUserId = fetchUserBetsByAuctionIdAndUserId;
    fetchAuctionById = fetchAuctionById;

    newBet = newBet;
    returnBetsBalance = returnBetsBalance;
    updateBetsToNextRound = updateBetsToNextRound;
    deleteBets = deleteBets;

    withTx(tx: TxClient): this {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, { tx });
    }
}
