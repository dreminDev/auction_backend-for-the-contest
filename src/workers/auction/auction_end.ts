import type { AuctionWorker } from "./worker";

export async function auctionEnd(this: AuctionWorker) {
    const auctions =
        await this.auctionService.fetchAuctionListByStatus("active");
    if (auctions.length === 0) {
        return;
    }

    const release = await this.mutex.acquire();

    try {
        console.log(`auctions`, auctions);
    } finally {
        release();
    }
}
