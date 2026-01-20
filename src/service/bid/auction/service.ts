import type { ActionBetRepo } from "../../../repo/actionBet/mongo/repo";
import type { BalanceRepo } from "../../../repo/balance/mongo/repo";
import type { ActionService } from "../../action/service";
import type { AuctionService } from "../../auction/service";
import type { BalanceService } from "../../balance/service";
import type { UserService } from "../../user/service";
import { newBet } from "./bet";
import {
    fetchActionBetListByAuctionId,
    fetchAuctionById,
    fetchAuctionLastBetByAuctionId,
} from "./fetch";

export class AuctionBidService {
    protected userService: UserService;
    protected auctionService: AuctionService;
    protected actionBetRepo: ActionBetRepo;
    protected balanceService: BalanceService;
    protected actionService: ActionService;
    protected balanceRepo: BalanceRepo;

    constructor(
        userService: UserService,
        auctionService: AuctionService,
        balanceService: BalanceService,
        actionService: ActionService,
        balanceRepo: BalanceRepo,
        actionBetRepo: ActionBetRepo
    ) {
        this.userService = userService;
        this.auctionService = auctionService;
        this.balanceService = balanceService;
        this.actionService = actionService;
        this.balanceRepo = balanceRepo;
        this.actionBetRepo = actionBetRepo;
    }
    fetchAuctionLastBetByAuctionId = fetchAuctionLastBetByAuctionId;
    fetchActionBetListByAuctionId = fetchActionBetListByAuctionId;
    fetchAuctionById = fetchAuctionById;
    newBet = newBet;
}
