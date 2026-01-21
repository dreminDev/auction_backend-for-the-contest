import type { FastifyInstance, FastifyRequest } from "fastify";

import type { AuctionService } from "../../../../service/auction/service";
import type { AuctionBidService } from "../../../../service/bid/auction/service";
import { bet } from "./bet";
import { createAuction } from "./create";
import type { CreateAuctionIn } from "./dto/create";
import type { FetchAuctionListByStatusIn } from "./dto/fetch";
import { fetchAuctionById, fetchAuctionListByStatus } from "./fetch";

export const httpAuctionPrefix = "/auction";

export class HttpAuctionController {
    protected app: FastifyInstance;
    protected auctionService: AuctionService;
    protected auctionBidService: AuctionBidService;

    constructor(
        app: FastifyInstance,
        auctionService: AuctionService,
        auctionBidService: AuctionBidService
    ) {
        this.app = app;
        this.auctionService = auctionService;
        this.auctionBidService = auctionBidService;
    }

    fetchAuctionListByStatus = fetchAuctionListByStatus;
    createAuction = createAuction;
    fetchAuctionById = fetchAuctionById;
    bet = bet;

    async setup() {
        await this.app.register(
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
            },
            { prefix: httpAuctionPrefix }
        );
    }
}
