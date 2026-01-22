import type { FetchWinnersByAuctionIdIn } from "../../repo/action/dto/fetch";
import type { ActionService } from "./service";

export async function fetchWinnersByAuctionId(
    this: ActionService,
    input: FetchWinnersByAuctionIdIn
) {
    return this.actionRepo.fetchWinnersByAuctionId(input);
}
