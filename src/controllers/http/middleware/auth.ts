import { type FastifyRequest } from "fastify";

import type { HttpMiddleware } from ".";
import { httpUserPrefix } from "../handlers/user";

export const userIdSym: unique symbol = Symbol("auth-user-id");
declare module "fastify" {
    export interface FastifyRequest {
        [userIdSym]: number;
    }
}

const fakeUser = {
    id: 987903832,
    username: "test",
    first_name: "test",
    last_name: "test",
};

export async function httpAuthMiddleware(
    this: HttpMiddleware,
    req: FastifyRequest
) {
    if (!req.url.includes(httpUserPrefix)) {
        return;
    }

    req[userIdSym] = fakeUser.id;

    await this.userService.registerUser({
        userId: fakeUser.id,
        username: fakeUser.username ?? null,
        first_name: fakeUser.first_name ?? null,
        last_name: fakeUser.last_name ?? null,
    });
}
