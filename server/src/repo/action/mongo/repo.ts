import type { PrismaClient } from "@prisma/client";

import { createWithTx, type TxClient } from "../../utils/tx";
import { createAction } from "./create";

export class ActionRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAction = createAction;

    withTx(tx: TxClient): this {
        return createWithTx(this, tx) as this;
    }
}
