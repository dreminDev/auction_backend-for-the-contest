import type { App } from ".";
import { config } from "../config";
import { BaseError } from "../error/customError";

export async function httpServer(this: App) {
    const httpServer = this.di.HttpServer();

    // Обработчик ошибок для правильного форматирования BaseError
    httpServer.setErrorHandler((error, request, reply) => {
        if (error instanceof BaseError) {
            return reply.status(error.statusCode).send({
                error: error.message,
                name: error.name,
            });
        }

        // Для других ошибок возвращаем 500
        this.di.logger.error({
            cause: error,
            message: "Unhandled error in HTTP handler",
        });

        return reply.status(500).send({
            error: "Internal server error",
        });
    });

    const httpMiddleware = this.di.HttpMiddleware();
    await httpMiddleware.setup();

    const httpUserController = this.di.HttpUserController();
    await httpUserController.setup();

    const httpAuctionController = this.di.HttpAuctionController();
    await httpAuctionController.setup();

    const httpGiftsController = this.di.HttpGiftsController();
    await httpGiftsController.setup();

    try {
        await httpServer.ready();

        await httpServer.listen({
            host: this.di.config.HTTP_SERVER_HOST,
            port: this.di.config.HTTP_SERVER_PORT,
        });

        this.di.logger.info(
            `HTTP server is running on ${this.di.config.HTTP_SERVER_HOST}:${this.di.config.HTTP_SERVER_PORT}`
        );
    } catch (error) {
        this.di.logger.error({
            cause: error,
            message: "some error ocured while starting HTTP server",
        });
    }
}
