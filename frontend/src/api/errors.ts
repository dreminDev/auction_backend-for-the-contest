export class OutOfStockError extends Error {
  constructor(message: string = 'Подарки из этой коллекции закончились') {
    super(message);
    this.name = 'OutOfStockError';
    Object.setPrototypeOf(this, OutOfStockError.prototype);
  }
}

/** Ошибка: ставка должна быть выше текущей выигрывающей */
export class BidTooLowError extends Error {
  public minBid: number;
  public currentBid: number;

  constructor(minBid: number, currentBid: number) {
    super(`Ставка должна быть больше ${minBid} ⭐. Ваша текущая ставка: ${currentBid} ⭐`);
    this.name = 'BidTooLowError';
    this.minBid = minBid;
    this.currentBid = currentBid;
    Object.setPrototypeOf(this, BidTooLowError.prototype);
  }
}
