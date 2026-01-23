import type { FastifyReply, FastifyRequest } from "fastify";

import type { HttpGiftsController } from ".";
import { userIdSym } from "../../middleware/auth";

export async function fetchUserGifts(
    this: HttpGiftsController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const userId = req[userIdSym];

    const out = await this.giftOwnerService.fetchGiftOwnersByUserId({
        userId,
    });

    res.send(out);
}

export async function fetchAvailableGifts(
    this: HttpGiftsController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const out = await this.giftCollectionService.fetchGiftCollectionsWithAvailable();

    res.send(out);
}
