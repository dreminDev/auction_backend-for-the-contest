import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { BalanceType } from "@prisma/client";

import type { HttpUserController } from ".";
import { userIdSym } from "../../middleware/auth";

const addBalanceValidator = z.object({
    amount: z.number().int().positive().optional().default(10000),
    type: z.enum(BalanceType).optional().default(BalanceType.stars),
});

export async function addBalance(
    this: HttpUserController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const userId = req[userIdSym];

    const validated = addBalanceValidator.safeParse(req.body);

    if (!validated.success) {
        return res.status(400).send({
            error: validated.error.issues,
        });
    }

    const balance = await this.balanceService.addBalance({
        userId,
        type: validated.data.type,
        amount: validated.data.amount,
    });

    return res.status(200).send(balance);
}
