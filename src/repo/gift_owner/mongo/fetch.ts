import type { FetchGiftOwnerIn } from "../dto/fetch";
import type { GiftOwnerRepo } from "./repo";

export async function fetchGiftOwner(
    this: GiftOwnerRepo,
    input: FetchGiftOwnerIn
) {
    const giftOwner = await this.db.giftOwner.findFirst({
        where: input,
    });

    return giftOwner;
}
