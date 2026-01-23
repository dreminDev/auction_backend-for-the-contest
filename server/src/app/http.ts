import type { App } from ".";

const API_PREFIX = "/contest";

export async function httpServer(this: App) {
    const httpServer = this.di.HttpServer();

    const httpMiddleware = this.di.HttpMiddleware();
    await httpMiddleware.setup();

    await httpServer.register(async (apiRouter) => {
        const httpUserController = this.di.HttpUserController();
        await httpUserController.setup(apiRouter);

        const httpAuctionController = this.di.HttpAuctionController();
        await httpAuctionController.setup(apiRouter);

        const httpGiftsController = this.di.HttpGiftsController();
        await httpGiftsController.setup(apiRouter);
    }, { prefix: API_PREFIX });

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
