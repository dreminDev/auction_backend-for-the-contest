import type { DI } from ".";
import { ActionRepo } from "../repo/action/mongo/repo";
import { ActionService } from "../service/action/service";

export function actionRepo(this: DI) {
    const actionRepo = new ActionRepo(this.Database());

    return this.set("actionRepo", actionRepo);
}

export function actionService(this: DI) {
    const actionService = new ActionService(this.ActionRepo());

    return this.set("actionService", actionService);
}
