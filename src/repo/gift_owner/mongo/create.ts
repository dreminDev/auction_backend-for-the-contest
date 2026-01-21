import type { CreateGiftOwnerIn } from "../dto/create";
import type { GiftOwnerRepo } from "./repo";

export async function createGiftOwner(
    this: GiftOwnerRepo,
    input: CreateGiftOwnerIn
) {
    const newGiftOwner = await this.db.giftOwner.create({
        data: input,
    });
    return newGiftOwner;
}
