import { getTxClient, type TxClient } from "../../utils/tx";
import type { UpdateBalanceIn } from "../dto/update";
import type { BalanceRepo } from "./repo";

export async function updateBalance(this: BalanceRepo, input: UpdateBalanceIn, tx?: TxClient) {
    const client = getTxClient(this.db, tx);

    const updatedBalance = await client.balance.update({
        where: {
            id: input.id,
        },
        data: {
            balance: input.balance,
        },
    });

    return updatedBalance;
}
