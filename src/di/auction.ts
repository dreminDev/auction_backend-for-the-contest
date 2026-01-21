import type { DI } from ".";
import { HttpAuctionController } from "../controllers/http/handlers/auction";
import { ActionBetRepo } from "../repo/action_bet/mongo/repo";
import { AuctionRepo } from "../repo/auction/mongo/repo";
import { AuctionService } from "../service/auction/service";
import { AuctionBidService } from "../service/bid/auction/service";
import { AuctionWorker } from "../workers/auction/worker";

export function httpAuctionController(this: DI) {
    const httpAuctionController = new HttpAuctionController(
        this.HttpServer(),
        this.AuctionService(),
        this.AuctionBidService()
    );

    return this.set("httpAuctionController", httpAuctionController);
}

export function auctionRepo(this: DI) {
    const auctionRepo = new AuctionRepo(this.Database());

    return this.set("auctionRepo", auctionRepo);
}

export function auctionService(this: DI) {
    const auctionService = new AuctionService(this.AuctionRepo());

    return this.set("auctionService", auctionService);
}

export function actionBetRepo(this: DI) {
    const actionBetRepo = new ActionBetRepo(this.Database());

    return this.set("actionBetRepo", actionBetRepo);
}

export function auctionBidService(this: DI) {
    const auctionBidService = new AuctionBidService(
        this.UserService(),
        this.AuctionService(),
        this.BalanceService(),
        this.ActionService(),
        this.BalanceRepo(),
        this.ActionBetRepo(),
        this.AuctionRepo(),
        this.ActionRepo()
    );

    return this.set("auctionBidService", auctionBidService);
}

export function auctionWorker(this: DI) {
    const auctionWorker = new AuctionWorker(
        this.Database(),
        this.AuctionBidService(),
        this.AuctionService(),
        this.GiftCollectionService(),
        this.GiftOwnerService()
    );

    return this.set("auctionWorker", auctionWorker);
}
