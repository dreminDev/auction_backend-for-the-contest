import type { CreateGiftOwnerIn } from "../../repo/gift_owner/dto/create";
import type { GiftOwnerService } from "./service";

export async function createGiftOwner(
    this: GiftOwnerService,
    input: CreateGiftOwnerIn
) {
    const giftOwner = await this.giftOwnerRepo.createGiftOwner(input);

    return giftOwner;
}

