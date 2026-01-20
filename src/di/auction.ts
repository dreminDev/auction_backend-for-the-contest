import type { DI } from ".";
import { HttpAuctionController } from "../controllers/http/handlers/auction";
import { AuctionRepo } from "../repo/auction/mongo/repo";
import { AuctionService } from "../service/auction/service";

export function httpAuctionController(this: DI) {
    const httpAuctionController = new HttpAuctionController(
        this.HttpServer(),
        this.AuctionService()
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
