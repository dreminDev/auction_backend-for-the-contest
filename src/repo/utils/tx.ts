import type { PrismaClient } from "@prisma/client";

export type TxClient = Parameters<
    Parameters<PrismaClient["$transaction"]>[0]
>[0];

export function getTxClient(db: PrismaClient, tx?: TxClient): TxClient {
    return tx ?? db;
}

export function createWithTx<T extends object>(repo: T, tx: TxClient): T {
    return new Proxy(repo, {
        get(target, prop) {
            const originalMethod = Reflect.get(target, prop);

            if (typeof originalMethod === "function") {
                return function (...args: unknown[]) {
                    return originalMethod.apply(target, [...args, tx]);
                };
            }

            return originalMethod;
        },
    });
}
