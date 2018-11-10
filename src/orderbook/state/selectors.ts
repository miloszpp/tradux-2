import {createSelector} from 'reselect';
import {Order, OrderType} from '../model';
import {prop, groupBy, mapObjIndexed, filter, sortBy, reverse, take, propEq} from 'ramda';
import {State} from '../../store';

const getOrderBookState = (state: State) => state.orderBook;

const getOrderBook = createSelector(
  getOrderBookState,
  (orderBookState) => orderBookState.book
);

const getOrders = createSelector(
  getOrderBook,
  (orderBook) => orderBook.orders,
);

export const getScreen = createSelector(
  getOrders,
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
);