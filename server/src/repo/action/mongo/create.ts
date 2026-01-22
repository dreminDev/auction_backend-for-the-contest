import { getTxClient, type TxClient } from "../../utils/tx";
import type { CreateActionIn, CreateWinnerActionIn } from "../dto/create";
import type { ActionRepo } from "./repo";

export async function createAction(this: ActionRepo, input: CreateActionIn, tx?: TxClient) {
    const client = getTxClient(this.db, tx);

    const newAction = await client.action.create({
        data: input,
    });

    return newAction;
}

export async function createManyWinnerActions(
    this: ActionRepo,
    input: CreateWinnerActionIn[],
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);

    await client.action.createMany({
        data: input.map((winner) => ({
            userId: winner.userId,
            action: "win" as any,
            addedAt: winner.addedAt,
            metaData: {
                auctionId: winner.auctionId,
                round: winner.round,
                amount: winner.amount,
                place: winner.place,
                giftCollectionId: winner.giftCollectionId,
            },
        })),
    });
}
