import type { HttpUserController } from ".";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function fetchByUser(
    this: HttpUserController,
    req: FastifyRequest,
    res: FastifyReply
) {}
