import type { PrismaClient } from "@prisma/client";

import { createAction } from "./create";

export class ActionRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createAction = createAction;
}
