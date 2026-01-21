import type { FastifyReply, FastifyRequest } from "fastify";

import type { HttpGiftsController } from ".";
import { userIdSym } from "../../middleware/auth";

export async function fetchUserGifts(this: HttpGiftsController, req: FastifyRequest, res: FastifyReply) {
    const userId = req[userIdSym];

    const gifts = await this.giftOwnerService.fetchGiftOwnersByUserId({
        userId,
    });

    res.send(gifts);
}

export async function fetchAvailableGifts(this: HttpGiftsController, req: FastifyRequest, res: FastifyReply) {
    const giftCollections = await this.giftCollectionService.fetchGiftCollections();

    res.send(giftCollections);
}

