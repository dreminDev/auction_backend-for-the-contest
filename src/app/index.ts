import { DI } from "../di";
import { httpServer } from "./http";

export class App {
    protected di: DI = new DI();

    HttpServer = httpServer;

    async start() {
        await Promise.all([this.HttpServer()]);
    }
}
