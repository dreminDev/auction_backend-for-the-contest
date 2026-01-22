export class OutOfStockError extends Error {
  constructor(message: string = 'Подарки из этой коллекции закончились') {
    super(message);
    this.name = 'OutOfStockError';
    Object.setPrototypeOf(this, OutOfStockError.prototype);
  }
}
