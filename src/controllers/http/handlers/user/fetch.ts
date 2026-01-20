import type { FastifyReply, FastifyRequest } from "fastify";

import type { HttpUserController } from ".";
import { NotFoundError } from "../../../../error/server";
import { userIdSym } from "../../middleware/auth";

export async function fetchByUser(
    this: HttpUserController,
    req: FastifyRequest,
    res: FastifyReply
) {
    const userId = req[userIdSym];

    const out = await this.userService.fetchUserById({
        userId,
    });

    if (!out) {
        throw new NotFoundError();
    }

    return res.status(200).send(out);
}
