import type { FastifyInstance } from "fastify";

export class HttpUserController {
    protected app: FastifyInstance;

    constructor(app: FastifyInstance) {
        this.app = app;
    }
}
