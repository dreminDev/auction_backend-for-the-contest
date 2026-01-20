import {
    parse,
    validate,
    type InitData,
} from "@telegram-apps/init-data-node";
import { type FastifyRequest } from "fastify";

import type { HttpMiddleware } from ".";
import { ErrorUnauthorized } from "../../../error/server";
import { httpUserPrefix } from "../handlers/user";

export const authSym: unique symbol = Symbol("auth");
export const userIdSym: unique symbol = Symbol("auth-user-id");

declare module "fastify" {
    export interface FastifyRequest {
        [userIdSym]: number;
        [authSym]: InitData;
    }
}

const fakeUser = {
    id: 987903832,
    username: "test",
    first_name: "test",
    last_name: "test",
}

export async function httpAuthMiddleware(
    this: HttpMiddleware,
    req: FastifyRequest
) {
    if (!req.url.includes(httpUserPrefix)) {
        return;
    }

    const authSign = req.headers.authorization;
    if (!authSign) {
        throw new ErrorUnauthorized();
    }

    // Ну потому что это пример, и что бы не мучится с запуском примера, валидацию офнул
    // validate(authSign, this.app.config.TELEGRAM_BOT_TOKEN);

    // const parsedSign = parse(authSign);
    // if (!parsedSign.user) {
    //     throw new ErrorUnauthorized();
    // }

    req[userIdSym] = fakeUser.id;
    // req[authSym] = parsedSign;

    await this.userService.registerUser({
        userId: fakeUser.id,
        username: fakeUser.username ?? null,
        first_name: fakeUser.first_name ?? null,
        last_name: fakeUser.last_name ?? null,
    });
}
