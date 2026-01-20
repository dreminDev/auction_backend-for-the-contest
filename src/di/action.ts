import type { DI } from ".";
import { ActionRepo } from "../repo/action/mongo/repo";

export function actionRepo(this: DI) {
    const actionRepo = new ActionRepo(this.Database());

    return this.set("actionRepo", actionRepo);
}
