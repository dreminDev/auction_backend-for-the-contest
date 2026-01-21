import type { FastifyInstance, FastifyRequest } from "fastify";

import type { GiftCollectionService } from "../../../../service/gift_collection/service";
import type { GiftOwnerService } from "../../../../service/gift_owner/service";
import { fetchAvailableGifts, fetchUserGifts } from "./fetch";

export const httpGiftsPrefix = "/gifts";

export class HttpGiftsController {
    protected app: FastifyInstance;
    protected giftOwnerService: GiftOwnerService;
    protected giftCollectionService: GiftCollectionService;

    constructor(
        app: FastifyInstance,
        giftOwnerService: GiftOwnerService,
        giftCollectionService: GiftCollectionService
    ) {
        this.app = app;
        this.giftOwnerService = giftOwnerService;
        this.giftCollectionService = giftCollectionService;
    }

    fetchUserGifts = fetchUserGifts;
    fetchAvailableGifts = fetchAvailableGifts;

    async setup() {
        await this.app.register(
            async (fastify) => {
                fastify.get("/my", async (req: FastifyRequest, res) =>
                    this.fetchUserGifts(req, res)
                );

                fastify.get("/collections", async (req: FastifyRequest, res) =>
                    this.fetchAvailableGifts(req, res)
                );
            },
            { prefix: httpGiftsPrefix }
        );
    }
}
