import { getTxClient, type TxClient } from "../../utils/tx";
import type { CreateActionIn } from "../dto/create";
import type { ActionRepo } from "./repo";

export async function createAction(
    this: ActionRepo,
    input: CreateActionIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    const newAction = await client.action.create({
        data: input,
    });

    return newAction;
}
