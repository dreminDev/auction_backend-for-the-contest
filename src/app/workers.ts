import type { App } from ".";

export async function workers(this: App) {
    const auctionWorker = this.di.AuctionWorker();
    await auctionWorker.setup();
}
