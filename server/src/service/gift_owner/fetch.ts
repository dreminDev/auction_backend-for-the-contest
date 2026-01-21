import type { FetchGiftOwnerIn, FetchGiftOwnersByUserIdIn } from "../../repo/gift_owner/dto/fetch";
import type { GiftOwnerService } from "./service";

export async function fetchGiftOwner(this: GiftOwnerService, input: FetchGiftOwnerIn) {
    const giftOwner = await this.giftOwnerRepo.fetchGiftOwner(input);

    return giftOwner;
}

export async function fetchGiftOwnersByUserId(
    this: GiftOwnerService,
    input: FetchGiftOwnersByUserIdIn
) {
    const giftOwners = await this.giftOwnerRepo.fetchGiftOwnersByUserId(input);

    return giftOwners;
}

export async function countGiftOwnersByGiftId(this: GiftOwnerService, input: { giftId: string }) {
    const count = await this.giftOwnerRepo.countGiftOwnersByGiftId({ giftId: input.giftId });

    return count;
}
