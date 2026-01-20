import type { HttpUserController } from ".";
import type { FastifyRequest, FastifyReply } from "fastify";
import { userIdSym } from "../../middleware/auth";
import { NotFoundError } from "../../../../error/server";

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
