import type { DI } from ".";
import { PrismaClient } from "@prisma/client";

export async function database(this: DI) {
    const prisma = new PrismaClient();

    return this.set("db", prisma);
}