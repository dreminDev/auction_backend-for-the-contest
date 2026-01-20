import type { DI } from ".";
import { HttpUserController } from "../controllers/http/handlers/user";
import { UserRepo } from "../repo/user/mongo/repo";
import { UserService } from "../service/user/service";

export function httpUserController(this: DI) {
    const httpUserController = new HttpUserController(
        this.HttpServer()
    );

    return this.set(
        "httpUserController",
        httpUserController
    );
}

export function userRepo(this: DI) {
    const userRepo = new UserRepo(this.Database());

    return this.set("userRepo", userRepo);
}

export function userService(this: DI) {
    const userService = new UserService(
        this.UserRepo(),
        this.BalanceRepo(),
        this.BalanceService()
    );

    return this.set("userService", userService);
}
