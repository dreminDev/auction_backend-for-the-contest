import { BalanceType } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import type { HttpAuctionController } from ".";

const betSchema = z.object({
    auctionId: z.string(),
    amount: z.number(),
    userId: z.number(),
    balanceType: z.enum(BalanceType),
});

export async function bet(
    this: HttpAuctionController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const validated = betSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(400).send({
            message: "Invalid input",
            errors: validated.error.issues,
        });
    }

    await this.auctionBidService.newBet({
        auctionId: validated.data.auctionId,
        amount: validated.data.amount,
        userId: validated.data.userId,
        balanceType: validated.data.balanceType,
    });

    res.status(204);
}
