import { getTxClient, type TxClient } from "../../utils/tx";
import type { CreateBalanceIn } from "../dto/create";
import type { BalanceRepo } from "./repo";

export async function createBalance(this: BalanceRepo, input: CreateBalanceIn, tx?: TxClient) {
    const client = getTxClient(this.db, tx);

    const newBalance = await client.balance.create({
        data: input,
    });

    return newBalance;
}
