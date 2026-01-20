import { z } from "zod";
import type { FastifyRequest, FastifyReply } from "fastify";
import { AuctionStatus } from "@prisma/client";

import type { HttpAuctionController } from ".";

import type { FetchAuctionListByStatusIn } from "./dto/fetch";

const validator = z.object({
    status: z.enum(AuctionStatus),
});

export async function fetchAuctionListByStatus(
    this: HttpAuctionController,
    req: FastifyRequest<{ Params: FetchAuctionListByStatusIn }>,
    res: FastifyReply
) {
    const validated = validator.safeParse(req.query);
    if (!validated.success) {
        return res
            .status(400)
            .send({ error: validated.error.message });
    }

    const out = await this.auctionService.fetchAuctionListByStatus(
        validated.data.status
    );

    res.send(out);
}
