import { DI } from "../di";
import { httpServer } from "./http";
import { workers } from "./workers";

export class App {
    protected di: DI = new DI();

    HttpServer = httpServer;
    Workers = workers;

    async start() {
        await Promise.all([this.HttpServer(), this.Workers()]);
    }
}
