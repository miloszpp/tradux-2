import {OrderBook, Order, OrderType, Transaction} from '../model';
import * as actions from './actions';
import {ActionType} from 'typesafe-actions';
import {PUT_ORDER} from './constants';
import {find, filter, sortBy, prop, findLast, pipe, eqProps, reject, evolve, identity, update, indexOf, remove, curry, concat, converge, assoc, findIndex, without, uncurryN} from 'ramda';
import {replace} from '../util/array';
import {makeTransaction} from '../util/transaction';

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

type OrderBookFn = ((book: OrderBook) => OrderBook);

const findMatchingOrder = (current: Order) =>
  pipe(
    filter<Order, 'array'>(eqProps('symbol', current)),
    reject<Order, 'array'>(eqProps('type', current)),
    sortBy(prop('price')),
    current.type === OrderType.Bid
      ? findLast<Order>((order) => order.price <= current.price)
      : find<Order>((order) => order.price >= current.price)
  );

const matchNonExhaustiveOrder = (current: Order, matching: Order): OrderBookFn => {
  const quantity = matching.quantity - current.quantity;
  const transaction = makeTransaction(current, matching, quantity);
  return evolve({
    orders: replace(matching, {...matching, quantity}),
    transactions: concat([transaction]), // NOTE append(transaction) doesn't Type correctly
  });
};

const matchExhaustiveOrder = (current: Order, matching: Order): OrderBookFn => {
  const quantity = current.quantity - matching.quantity;
  const transaction = makeTransaction(current, matching, quantity);
  const updatedOrder = {...current, quantity};
  return pipe(
    evolve({
      orders: without<Order>([matching]),
      transactions: concat([transaction]),
    }),
    findAndMatchOrder(updatedOrder),
  );
}

const matchOrder = curry((current: Order, matching: Order | undefined): OrderBookFn => 
  matching !== undefined
    ? current.quantity < matching.quantity
        ? matchNonExhaustiveOrder(current, matching)
        : matchExhaustiveOrder(current, matching)
    : current.quantity > 0
        ? evolve({ orders: concat([current]) })
        : identity
);

const findAndMatchOrder = (current: Order): OrderBookFn =>
  converge(
    uncurryN(2, matchOrder(current)),
    [
      pipe(prop<'orders', Order[]>('orders'), findMatchingOrder(current)),
      identity
    ]
  );

export const orderBookReducer = (state: OrderBookState = initialState, action: OrderBookAction): OrderBookState => {
  switch (action.type) {
    case PUT_ORDER:
      return evolve({ book: findAndMatchOrder(action.payload) }, state);
    default:
      return state;
  }
}