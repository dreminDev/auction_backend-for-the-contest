import { PrismaClient } from "@prisma/client";

import type { DI } from ".";

export function database(this: DI) {
    // config load from prisma.config.ts
    const database = new PrismaClient();

    return this.set("db", database);
}
