import type { UpdateAuctionIn } from "../../repo/auction/dto/update";
import type { AuctionService } from "./service";

export async function updateAuction(this: AuctionService, input: UpdateAuctionIn) {
    const tx = this.tx;
    const auctionRepo = tx ? this.auctionRepo.withTx(tx) : this.auctionRepo;

    return auctionRepo.updateAuction(input, tx);
}
