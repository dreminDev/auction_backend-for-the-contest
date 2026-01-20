import type { DI } from ".";
import { PrismaClient } from "@prisma/client";

export async function database(this: DI) {
    // Prisma 7: Connection URL is read from prisma.config.ts
    // For direct connections, PrismaClient reads from config automatically
    const prisma = new PrismaClient();

    return this.set("db", prisma);
}