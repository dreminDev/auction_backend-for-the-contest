import type { FastifyInstance } from "fastify";

import type { UserService } from "../../../service/user/service";
import { httpAuthMiddleware } from "./auth";

export class HttpMiddleware {
    protected app: FastifyInstance;
    protected userService: UserService;

    constructor(app: FastifyInstance, userService: UserService) {
        this.app = app;
        this.userService = userService;
    }

    httpAuthMiddleware = httpAuthMiddleware;

    async setup() {
        this.app.addHook("onRequest", async (req, _) => this.httpAuthMiddleware(req));
    }
}
