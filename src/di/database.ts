import type { DI } from ".";
import { PrismaClient } from "@prisma/client";

export async function database(this: DI) {
    // config load from prisma.config.ts
    const database = new PrismaClient();

    return this.set("db", database);
}