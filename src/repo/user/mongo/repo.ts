import type { PrismaClient } from "@prisma/client";

import { createUser } from "./create";
import { fetchUser } from "./fetch";

export class UserRepo {
    readonly db: PrismaClient;

    constructor(db: PrismaClient) {
        this.db = db;
    }

    createUser = createUser;
    fetchUser = fetchUser;
}
