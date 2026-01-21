import { getTxClient, type TxClient } from "../../utils/tx";
import type { FetchGiftOwnerIn, FetchGiftOwnerLastSerialNumberIn, FetchGiftOwnersByUserIdIn } from "../dto/fetch";
import type { GiftOwnerRepo } from "./repo";

export async function fetchGiftOwner(this: GiftOwnerRepo, input: FetchGiftOwnerIn, tx?: TxClient) {
    const client = getTxClient(this.db, tx);
    const giftOwner = await client.giftOwner.findFirst({
        where: input,
    });

    return giftOwner;
}

export async function fetchGiftOwnersByUserId(
    this: GiftOwnerRepo,
    input: FetchGiftOwnersByUserIdIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);
    const giftOwners = await client.giftOwner.findMany({
        where: {
            ownerId: input.userId,
        },
        orderBy: {
            addedAt: "desc",
        },
    });

    return giftOwners;
}

export async function fetchGiftOwnerLastSerialNumber(
    this: GiftOwnerRepo,
    input: FetchGiftOwnerLastSerialNumberIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);
    const giftOwner = await client.giftOwner.findFirst({
        where: { giftId: input.giftId },
        orderBy: { serialNumber: "desc" },
    });

    return giftOwner;
}
