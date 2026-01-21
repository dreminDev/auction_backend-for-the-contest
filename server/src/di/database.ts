import { PrismaClient } from "@prisma/client";

import type { DI } from ".";

export function database(this: DI) {
    const database = new PrismaClient();

    return this.set("db", database);
}
