import type { DI } from ".";
import { HttpUserController } from "../controllers/http/handlers/user";
import { HttpMiddleware } from "../controllers/http/middleware";
import { UserRepo } from "../repo/user/mongo/repo";
import { UserService } from "../service/user/service";

export function httpUserController(this: DI) {
    const httpUserController = new HttpUserController(
        this.HttpServer(),
        this.UserService(),
        this.BalanceService()
    );

    return this.set("httpUserController", httpUserController);
}

export function userRepo(this: DI) {
    const userRepo = new UserRepo(this.Database());

    return this.set("userRepo", userRepo);
}

export function userService(this: DI) {
    const userService = new UserService(
        this.Database(),
        this.UserRepo(),
        this.BalanceRepo(),
        this.BalanceService(),
        this.ActionService()
    );

    return this.set("userService", userService);
}

export function httpMiddleware(this: DI) {
    const httpMiddleware = new HttpMiddleware(this.HttpServer(), this.UserService());

    return this.set("httpMiddleware", httpMiddleware);
}
