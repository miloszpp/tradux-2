import {createSelector} from 'reselect';
import {Order, OrderType, OrderScreenSymbol, OrderBook, Transaction} from '../model';
import {prop, groupBy, mapObjIndexed, filter, sortBy, reverse, take, propEq, pipe} from 'ramda';
import {OrderBookState} from './reducers';

export const getOrderBookState = prop<'orderBook', OrderBookState>('orderBook');

export const getOrderBook = createSelector(
  getOrderBookState,
  prop<'book', OrderBook>('book'),
);

export const getOrders = createSelector(
  getOrderBook,
  prop<'orders', Order[]>('orders'),
);

export const getTransactions = createSelector(
  getOrderBook,
  prop<'transactions', Transaction[]>('transactions'),
);

export const getScreen = createSelector(
  getOrders,
  pipe(
    groupBy<Order>(prop<'symbol', string>('symbol')),
    mapObjIndexed<Order[], OrderScreenSymbol>((symbolOrders) => {
      const bidOrders = filter<Order>(propEq('type', OrderType.Bid), symbolOrders);
      const askOrders = filter<Order>(propEq('type', OrderType.Ask), symbolOrders);
      return {
        bid: take(5, reverse(sortBy(prop<'price', number>('price'), bidOrders))),
        ask: take(5, sortBy(prop<'price', number>('price'), askOrders)),
      }
    }),
  )
);