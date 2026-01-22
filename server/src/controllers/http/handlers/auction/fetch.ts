import { AuctionStatus } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import type { HttpAuctionController } from ".";
import type { FetchAuctionListByStatusIn } from "./dto/fetch";

const fetchAuctionListByStatusValidator = z.object({
    status: z.enum(AuctionStatus),
});

export async function fetchAuctionListByStatus(
    this: HttpAuctionController,
    req: FastifyRequest<{ Params: FetchAuctionListByStatusIn }>,
    res: FastifyReply
) {
    const validated = fetchAuctionListByStatusValidator.safeParse(req.query);
    if (!validated.success) {
        return res.status(400).send({ error: validated.error.issues });
    }

    const out = await this.auctionService.fetchAuctionListByStatus(validated.data.status);

    res.send(out);
}

const fetchAuctionByIdValidator = z.object({
    auctionId: z.string(),
    limit: z.coerce.number().optional().default(50),
    offset: z.coerce.number().optional().default(0),
});

export async function fetchAuctionById(
    this: HttpAuctionController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const validated = fetchAuctionByIdValidator.safeParse(req.query);
    if (!validated.success) {
        return res.status(400).send({ error: validated.error.issues });
    }

    if (validated.data.limit && validated.data.limit > 50) {
        return res.status(400).send({ error: "limit must be less than or equal to 50" });
    }

    const out = await this.auctionBidService.fetchAuctionById({
        auctionId: validated.data.auctionId,
        limit: validated.data.limit,
        offset: validated.data.offset,
    });

    res.send(out);
}

const fetchAuctionWinnersValidator = z.object({
    auctionId: z.string(),
});

export async function fetchAuctionWinners(
    this: HttpAuctionController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const validated = fetchAuctionWinnersValidator.safeParse(req.query);
    if (!validated.success) {
        return res.status(400).send({ error: validated.error.issues });
    }

    const winners = await this.actionService.fetchWinnersByAuctionId({
        auctionId: validated.data.auctionId,
    });

    res.send(winners);
}
