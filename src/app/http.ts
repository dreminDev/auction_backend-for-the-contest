import type { App } from ".";
import { config } from "../config";
import { onExit } from "../utils/closer";

export async function httpServer(this: App) {
    const httpServer = this.di.HttpServer();

    try {
        await httpServer.ready();

        await httpServer.listen({
            host: config.HTTP_SERVER_HOST,
            port: config.HTTP_SERVER_PORT,
        });

        this.di.logger.info(
            `HTTP server is running on ${config.HTTP_SERVER_HOST}:${config.HTTP_SERVER_PORT}`
        );
    } catch (error) {
        this.di.logger.error({
            cause: error,
            message: "some error ocured while starting HTTP server",
        });
    }
}
