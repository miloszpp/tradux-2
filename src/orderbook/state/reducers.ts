import {OrderBook, Order, OrderType, Transaction} from '../model';
import * as actions from './actions';
import {ActionType} from 'typesafe-actions';
import {PUT_ORDER} from './constants';
import {find, filter, sortBy, prop, findLast, pipe, eqProps, reject, evolve, identity, update, indexOf, remove, curry, concat} from 'ramda';

export type OrderBookAction = ActionType<typeof actions>;

export type OrderBookState = {
  readonly book: OrderBook;
}

export const initialState: OrderBookState = {
  book: {
    orders: [
      { id: 1, price: 100, quantity: 30, symbol: 'GOOG', type: OrderType.Ask, timestamp: new Date() },
      { id: 2, price: 90, quantity: 30, symbol: 'GOOG', type: OrderType.Bid, timestamp: new Date() },
      { id: 2, price: 200, quantity: 50, symbol: 'AAPL', type: OrderType.Bid, timestamp: new Date() },
    ],
    transactions: [],
  }
};

const findMatchingOrder = (currentOrder: Order) =>
  pipe(
    filter<Order, 'array'>(eqProps('symbol', currentOrder)),
    reject<Order, 'array'>(eqProps('type', currentOrder)),
    sortBy(prop('price')),
    currentOrder.type === OrderType.Bid
      ? findLast<Order>((order) => order.price <= currentOrder.price)
      : find<Order>((order) => order.price >= currentOrder.price)
  );

const makeTransaction = (active: Order, passive: Order, quantity: number): Transaction => ({
  activeOrderId: active.id,
  passiveOrderId: passive.id,
  price: passive.price,
  quantity,
  symbol: active.symbol,
  timestamp: new Date()
});

type OrderBookFn = ((book: OrderBook) => OrderBook);

const matchNonExhaustiveOrder = (
  currentOrder: Order, 
  matchingOrder: Order, 
  matchingIndex: number
): OrderBookFn => {
  const quantity = matchingOrder.quantity - currentOrder.quantity;
  const transaction = makeTransaction(currentOrder, matchingOrder, quantity);
  return evolve({
    orders: update(matchingIndex, {...matchingOrder, quantity}),
    transactions: concat([transaction]), // NOTE append(transaction) doesn't Type correctly
  });
};

const matchExhaustiveOrder = (
  currentOrder: Order, 
  matchingOrder: Order, 
  matchingIndex: number
): OrderBookFn => {
  const quantity = currentOrder.quantity - matchingOrder.quantity;
  const transaction = makeTransaction(currentOrder, matchingOrder, quantity);
  const updatedOrder = {...currentOrder, quantity};
  return pipe(
    evolve({
      orders: remove<Order>(matchingIndex, 1),
      transactions: concat([transaction]),
    }),
    matchOrder(updatedOrder),
  )
}

const matchAnyOrder = curry((
  currentOrder: Order, 
  matchingOrder: Order | undefined, 
  matchingOrderIndex: number
): OrderBookFn => {
  if (matchingOrder !== undefined) {
    if (currentOrder.quantity < matchingOrder.quantity) {
      return matchNonExhaustiveOrder(currentOrder, matchingOrder, matchingOrderIndex);
    } else {
      return matchExhaustiveOrder(currentOrder, matchingOrder, matchingOrderIndex);
    }
  } else {
    if (currentOrder.quantity > 0 ) {
      return evolve({
        orders: concat([currentOrder]),
      });
    } else {
      return identity;
    }
  }
});

const matchOrder = curry((currentOrder: Order, book: OrderBook): OrderBook => {
  const matching = findMatchingOrder(currentOrder)(book.orders);
  const matchingIndex = indexOf(matching, book.orders);
  return matchAnyOrder(currentOrder, matching, matchingIndex)(book);
});

export const orderBookReducer = (state: OrderBookState = initialState, action: OrderBookAction): OrderBookState => {
  switch (action.type) {
    case PUT_ORDER:
      return evolve({
        book: matchOrder(action.payload)
      }, state);
    default:
      return state;
  }
}