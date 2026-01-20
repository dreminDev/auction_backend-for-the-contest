import { type FastifyRequest } from "fastify";
import {
    type InitData,
    parse,
    validate,
} from "@telegram-apps/init-data-node";

import type { HttpMiddleware } from ".";
import { ErrorUnauthorized } from "../../../error/server";

export const authSym: unique symbol = Symbol("auth");
export const userIdSym: unique symbol = Symbol("auth-user-id");

declare module "fastify" {
    export interface FastifyRequest {
        [userIdSym]: number;
        [authSym]: InitData;
    }
}

export async function httpAuthMiddleware(
    this: HttpMiddleware,
    req: FastifyRequest
) {
    const authSign = req.headers.authorization;
    if (!authSign) {
        throw new ErrorUnauthorized();
    }

    // Ну потому что это пример, и что бы не мучится с запуском примера, валидацию офнул
    // validate(authSign, this.app.config.TELEGRAM_BOT_TOKEN);

    const parsedSign = parse(authSign);
    if (!parsedSign.user) {
        throw new ErrorUnauthorized();
    }

    req[userIdSym] = parsedSign.user.id;
    req[authSym] = parsedSign;

    await this.userService.registerUser({
        userId: parsedSign.user.id,
        username: parsedSign.user.username ?? null,
        first_name: parsedSign.user.first_name ?? null,
        last_name: parsedSign.user.last_name ?? null,
    });
}
