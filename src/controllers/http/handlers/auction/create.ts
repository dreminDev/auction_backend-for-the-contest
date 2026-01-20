import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import type { HttpAuctionController } from ".";
import type { CreateAuctionIn } from "./dto/create";

const validator = z.object({
    roundCount: z.number().min(1).max(100),
    roundDuration: z.number().min(5_000),
    supplyCount: z.number().min(1),
});

export async function createAuction(
    this: HttpAuctionController,
    req: FastifyRequest<{ Body: CreateAuctionIn }>,
    res: FastifyReply
) {
    const validated = validator.safeParse(req.body);
    if (!validated.success) {
        return res
            .status(400)
            .send({ error: validated.error.message });
    }

    const input: CreateAuctionIn = {
        roundCount: validated.data.roundCount,
        roundDuration: validated.data.roundDuration,
        roundStartTime: new Date(),
        roundEndTime: new Date(
            Date.now() + validated.data.roundDuration * 1000
        ),
        supplyCount: validated.data.supplyCount,
    };

    const out = await this.auctionService.createAuction(input);

    res.send(out);
}
