import { NotFoundError, OutOfStockError } from "../../error/customError";
import type { CreateGiftOwnerIn } from "../../repo/gift_owner/dto/create";
import type { CreateGiftOwnerUniqueIn } from "./dto/create";
import type { TxClient } from "../../repo/utils/tx";
import type { GiftOwnerService } from "./service";

export async function createGiftOwner(
    this: GiftOwnerService,
    input: CreateGiftOwnerIn,
    tx?: TxClient
) {
    const giftOwnerRepo = tx
        ? this.giftOwnerRepo.withTx(tx)
        : this.giftOwnerRepo;
    const giftOwner = await giftOwnerRepo.createGiftOwner(input, tx);

    return giftOwner;
}

export async function createGiftOwnerUnique(
    this: GiftOwnerService,
    input: CreateGiftOwnerUniqueIn | CreateGiftOwnerUniqueIn[],
    tx?: TxClient
) {
    const inputs = Array.isArray(input) ? input : [input];

    if (inputs.length === 0) {
        return [];
    }

    // Все записи должны быть из одной коллекции подарков
    const giftCollectionId = inputs[0]!.giftCollectionId;
    const allSameCollection = inputs.every(
        (inp) => inp.giftCollectionId === giftCollectionId
    );

    if (!allSameCollection) {
        throw new Error("All inputs must have the same giftCollectionId");
    }

    const giftOwnerRepo = tx
        ? this.giftOwnerRepo.withTx(tx)
        : this.giftOwnerRepo;

    const [giftInfo, giftLastSerialId] = await Promise.all([
        this.giftCollectionService.fetchGiftCollection({
            id: giftCollectionId,
        }),
        giftOwnerRepo.fetchGiftOwnerLastSerialNumber({
            giftId: giftCollectionId,
        }, tx),
    ]);

    if (!giftInfo) {
        throw new NotFoundError("Gift collection not found");
    }

    const lastSerialId = giftLastSerialId?.serialNumber ?? 0;
    const requiredSupply = lastSerialId + inputs.length;

    if (giftInfo.supplyCount < requiredSupply) {
        throw new OutOfStockError("Gift collection is out of stock");
    }

    const giftOwnersToCreate: CreateGiftOwnerIn[] = inputs.map(
        (inp, index) => ({
            ownerId: inp.userId,
            giftId: giftInfo.id,
            serialNumber: lastSerialId + index + 1,
        })
    );

    const createdGiftOwners =
        await giftOwnerRepo.createManyGiftOwners(giftOwnersToCreate, tx);

    return Array.isArray(input) ? createdGiftOwners : createdGiftOwners[0];
}
