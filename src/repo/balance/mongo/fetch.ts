import { getTxClient, type TxClient } from "../../utils/tx";
import type {
    FetchBalanceIn,
    FetchBalancesByUserIdIn,
} from "../dto/fetch";
import type { BalanceRepo } from "./repo";

export async function fetchBalanceByIdAndType(
    this: BalanceRepo,
    input: FetchBalanceIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const balance = await client.balance.findFirst({
        where: {
            userId: input.userId,
            type: input.type,
        },
    });

    return balance;
}

export async function fetchBalancesByUserId(
    this: BalanceRepo,
    input: FetchBalancesByUserIdIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const balances = await client.balance.findMany({
        where: {
            userId: input.userId,
        },
    });

    return balances;
}
