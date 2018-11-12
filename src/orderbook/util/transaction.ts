import {Order, Transaction} from '../model';

export const makeTransaction = (active: Order, passive: Order, quantity: number): Transaction => ({
  activeOrderId: active.id,
  passiveOrderId: passive.id,
  price: passive.price,
  quantity,
  symbol: active.symbol,
  timestamp: new Date()
});