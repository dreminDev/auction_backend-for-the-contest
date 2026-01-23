import type { PrismaClient } from "@prisma/client";

export type TxClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

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

export async function transactionWithRetry<T>(
    db: PrismaClient,
    callback: (tx: TxClient) => Promise<T>,
    options?: {
        maxRetries?: number;
        maxWait?: number;
        timeout?: number;
    }
): Promise<T> {
    const maxRetries = options?.maxRetries ?? 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            return await db.$transaction(
                callback,
                {
                    maxWait: options?.maxWait ?? 30_000,
                    timeout: options?.timeout ?? 120_000,
                }
            );
        } catch (error: any) {
            if (error?.code === "P2034" && retries < maxRetries - 1) {
                retries++;
                const delay = Math.min(100 * Math.pow(2, retries), 1000);
                await new Promise((resolve) => setTimeout(resolve, delay));
                continue;
            }
            throw error;
        }
    }

    throw new Error("Transaction failed after max retries");
}
