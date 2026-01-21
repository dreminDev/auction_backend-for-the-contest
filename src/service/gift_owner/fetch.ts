import type { FetchGiftOwnerIn } from "../../repo/gift_owner/dto/fetch";
import type { GiftOwnerService } from "./service";

export async function fetchGiftOwner(
    this: GiftOwnerService,
    input: FetchGiftOwnerIn
) {
    const giftOwner = await this.giftOwnerRepo.fetchGiftOwner(input);

    return giftOwner;
}
