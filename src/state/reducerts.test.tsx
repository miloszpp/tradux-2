import React from 'react';
import {State, reducer} from './reducers';
import {OrderType, Order} from './types';

it('matches exactly opposite order', () => {
  const state: State = {
    book: {
      orders: [ sampleOrder({ type: OrderType.Bid }) ],
      transactions: [],
    }
  };
  const newOrder: Order = sampleOrder({ type: OrderType.Ask });

  const { book: { orders, transactions } } = reducer(state, { type: '@@orderbook/put', payload: newOrder });

  expect(orders.length).toBe(0);
  expect(transactions.length).toBe(1);
});

it('matches inexhaustive order', () => {
  const state: State = {
    book: {
      orders: [ 
        sampleOrder({ type: OrderType.Bid, quantity: 100 }),
        sampleOrder({ type: OrderType.Bid, quantity: 100 }),
      ],
      transactions: [],
    }
  };
  const newOrder: Order = sampleOrder({ type: OrderType.Ask, quantity: 150 });

  const { book: { orders, transactions } } = reducer(state, { type: '@@orderbook/put', payload: newOrder });

  expect(orders.length).toBe(1);
  expect(orders[0].quantity).toBe(50);
  expect(transactions.length).toBe(2);
});

it('matches exhaustive order', () => {
  const state: State = {
    book: {
      orders: [ 
        sampleOrder({ type: OrderType.Bid, quantity: 200 }),
      ],
      transactions: [],
    }
  };
  const newOrder: Order = sampleOrder({ type: OrderType.Ask, quantity: 150 });

  const { book: { orders, transactions } } = reducer(state, { type: '@@orderbook/put', payload: newOrder });

  expect(orders.length).toBe(1);
  expect(orders[0].quantity).toBe(50);
  expect(transactions.length).toBe(1);
});

it('does not match if price too high', () => {
  const state: State = {
    book: {
      orders: [ 
        sampleOrder({ type: OrderType.Bid, price: 19 }),
      ],
      transactions: [],
    }
  };
  const newOrder: Order = sampleOrder({ type: OrderType.Ask, price: 20 });

  const { book: { orders, transactions } } = reducer(state, { type: '@@orderbook/put', payload: newOrder });

  expect(orders.length).toBe(2);
  expect(transactions.length).toBe(0);
});

it('does not match if symbol doesnt match', () => {
  const state: State = {
    book: {
      orders: [ 
        sampleOrder({ type: OrderType.Bid, price: 21, symbol: 'A' }),
      ],
      transactions: [],
    }
  };
  const newOrder: Order = sampleOrder({ type: OrderType.Ask, price: 20, symbol: 'B' });

  const { book: { orders, transactions } } = reducer(state, { type: '@@orderbook/put', payload: newOrder });

  expect(orders.length).toBe(2);
  expect(transactions.length).toBe(0);
});

it('matches several orders', () => {
  const state: State = {
    book: {
      orders: [ 
        sampleOrder({ type: OrderType.Bid, price: 19, symbol: 'A' }),
        sampleOrder({ type: OrderType.Bid, price: 21, symbol: 'A', quantity: 100 }),
        sampleOrder({ type: OrderType.Bid, price: 23, symbol: 'A', quantity: 100 }),
        sampleOrder({ type: OrderType.Bid, price: 25, symbol: 'A', quantity: 100 }),
      ],
      transactions: [],
    }
  };
  const newOrder: Order = sampleOrder({ type: OrderType.Ask, price: 20, symbol: 'A', quantity: 350 });

  const { book: { orders, transactions } } = reducer(state, { type: '@@orderbook/put', payload: newOrder });

  expect(orders.length).toBe(2);
  expect(transactions.length).toBe(3);
});

function sampleOrder({
  id = 2,
  price = 100,
  quantity = 10,
  symbol = 'GOOG',
  type = OrderType.Bid,
  timestamp = new Date()
}: Partial<Order>) {
  return {
    id, 
    price, 
    quantity, 
    symbol, 
    timestamp, 
    type,
  };
}