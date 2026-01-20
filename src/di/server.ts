import type { DI } from ".";
import Fastify, { type FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import { config } from "../config";
import { httpCorsConfig } from "../config/server";

export function httpServer(this: DI) {
    const httpServer = Fastify({
        logger: config.ENV === "development" ? this.logger : false,
    });

    httpServer.register(fastifyCors, httpCorsConfig());

    return this.set("httpServer", httpServer);
}
