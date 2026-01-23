import type { FastifyInstance, FastifyRequest } from "fastify";

import type { ActionService } from "../../../../service/action/service";
import type { AuctionService } from "../../../../service/auction/service";
import type { AuctionBidService } from "../../../../service/bid/auction/service";
import { bet } from "./bet";
import { createAuction } from "./create";
import type { CreateAuctionIn } from "./dto/create";
import type { FetchAuctionListByStatusIn } from "./dto/fetch";
import { fetchAuctionById, fetchAuctionListByStatus, fetchAuctionWinners } from "./fetch";

export const httpAuctionPrefix = "/auction";

export class HttpAuctionController {
    protected app: FastifyInstance;
    protected auctionService: AuctionService;
    protected auctionBidService: AuctionBidService;
    protected actionService: ActionService;

    constructor(
        app: FastifyInstance,
        auctionService: AuctionService,
        auctionBidService: AuctionBidService,
        actionService: ActionService
    ) {
        this.app = app;
        this.auctionService = auctionService;
        this.auctionBidService = auctionBidService;
        this.actionService = actionService;
    }

    fetchAuctionListByStatus = fetchAuctionListByStatus;
    createAuction = createAuction;
    fetchAuctionById = fetchAuctionById;
    fetchAuctionWinners = fetchAuctionWinners;
    bet = bet;

    async setup(app: FastifyInstance) {
        await app.register(
            async (fastify) => {
                fastify.get(
                    "/",
                    async (
                        req: FastifyRequest<{
                            Params: FetchAuctionListByStatusIn;
                        }>,
                        res
                    ) => this.fetchAuctionListByStatus(req, res)
                );

                fastify.put(
                    "/",
                    async (
                        req: FastifyRequest<{
                            Body: CreateAuctionIn;
                        }>,
                        res
                    ) => this.createAuction(req, res)
                );

                fastify.post("/bet", async (req, res) => this.bet(req, res));

                fastify.get("/info", async (req: FastifyRequest, res) =>
                    this.fetchAuctionById(req, res)
                );

                fastify.get("/winners", async (req: FastifyRequest, res) =>
                    this.fetchAuctionWinners(req, res)
                );
            },
            { prefix: httpAuctionPrefix }
        );
    }
}
