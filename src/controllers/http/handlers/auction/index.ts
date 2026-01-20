import type { FastifyInstance, FastifyRequest } from "fastify";

import type { AuctionService } from "../../../../service/auction/service";
import type { AuctionBidService } from "../../../../service/bid/auction/service";
import type { FetchAuctionListByStatusIn } from "./dto/fetch";
import { fetchAuctionListByStatus } from "./fetch";

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
            },

            { prefix: httpAuctionPrefix }
        );
    }
}
