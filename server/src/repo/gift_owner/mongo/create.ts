import { getTxClient, type TxClient } from "../../utils/tx";
import type { CreateGiftOwnerIn } from "../dto/create";
import type { GiftOwnerRepo } from "./repo";

export async function createGiftOwner(
    this: GiftOwnerRepo,
    input: CreateGiftOwnerIn,
    tx?: TxClient
) {
    const client = getTxClient(this.db, tx);
    const newGiftOwner = await client.giftOwner.create({
        data: input,
    });

    return newGiftOwner;
}

export async function createManyGiftOwners(
    this: GiftOwnerRepo,
    inputs: CreateGiftOwnerIn[],
    tx?: TxClient
) {
    if (inputs.length === 0) {
        return [];
    }

    const client = getTxClient(this.db, tx);

    await client.giftOwner.createMany({
        data: inputs,
    });

    // Получаем созданные записи по комбинации всех полей
    const createdGiftOwners = await client.giftOwner.findMany({
        where: {
            OR: inputs.map((input) => ({
                ownerId: input.ownerId,
                giftId: input.giftId,
                serialNumber: input.serialNumber,
            })),
        },
        orderBy: {
            serialNumber: "asc",
        },
    });

    return createdGiftOwners;
}
