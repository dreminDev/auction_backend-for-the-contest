import type { ActionRepo } from "../../repo/action/mongo/repo";
import { newAction } from "./new_action";

export class ActionService {
    protected actionRepo: ActionRepo;

    constructor(actionRepo: ActionRepo) {
        this.actionRepo = actionRepo;
    }

    newAction = newAction;
}
