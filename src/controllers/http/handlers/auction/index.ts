import type {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
} from "fastify";
import type { AuctionService } from "../../../../service/auction/service";
import { fetchAuctionListByStatus } from "./fetch";
import type { FetchAuctionListByStatusIn } from "./dto/fetch";

export const httpAuctionPrefix = "/auction";

export class HttpAuctionController {
    protected app: FastifyInstance;
    protected auctionService: AuctionService;

    constructor(
        app: FastifyInstance,
        auctionService: AuctionService
    ) {
        this.app = app;
        this.auctionService = auctionService;
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
