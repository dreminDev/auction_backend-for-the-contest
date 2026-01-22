import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createAction, createManyWinnerActions } from "./create";
import { fetchWinnersByAuctionId } from "./fetch";

export class ActionRepo {
    protected db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAction = createAction;
    createManyWinnerActions = createManyWinnerActions;
    fetchWinnersByAuctionId = fetchWinnersByAuctionId;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
