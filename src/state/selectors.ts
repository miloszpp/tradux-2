import { createSelector } from 'reselect';
import {State} from './reducers';
import {OrderBook, Order, OrderType} from './types';
import {prop, groupBy, mapObjIndexed, sort, filter, eqProps, sortBy, pipe, reverse, take, propEq} from 'ramda';

const bookSelector = (state: State) => state.book;

const ordersSelector = createSelector(
  bookSelector,
  prop<'orders', Order[]>('orders'),
);

export const screenSelector = createSelector(
  ordersSelector,
  (orders) => {
    const groupedBySymbol = groupBy(prop<'symbol', string>('symbol'), orders);
    return mapObjIndexed((symbolOrders, {}, {}) => {
      const bidOrders = filter<Order>(propEq('type', OrderType.Bid), symbolOrders);
      const askOrders = filter<Order>(propEq('type', OrderType.Ask), symbolOrders);
      console.log(bidOrders);
      return {
        bid: take(5, reverse(sortBy(prop<'price', number>('price'), bidOrders))),
        ask: take(5, sortBy(prop<'price', number>('price'), askOrders)),
      }
    }, groupedBySymbol);
  }
)