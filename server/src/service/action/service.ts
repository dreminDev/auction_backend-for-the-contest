import type { ActionRepo } from "../../repo/action/mongo/repo";
import type { TxClient } from "../../repo/utils/tx";
import { createManyWinnerActions } from "./create_winners";
import { fetchWinnersByAuctionId } from "./fetch";
import { newAction } from "./new_action";

export class ActionService {
    protected actionRepo: ActionRepo;
    protected tx?: TxClient;

    constructor(actionRepo: ActionRepo) {
        this.actionRepo = actionRepo;
    }

    newAction = newAction;
    createManyWinnerActions = createManyWinnerActions;
    fetchWinnersByAuctionId = fetchWinnersByAuctionId;

    withTx(tx: TxClient): this {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, { tx });
    }
}
