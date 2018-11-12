import {OrderBookState, orderBookReducer, OrderBookAction} from './orderbook/state/reducers';
import {combineReducers, createStore} from 'redux';
import {StateType} from 'typesafe-actions';

export type RootAction = OrderBookAction;

export type State = StateType<typeof rootReducer>;

export const rootReducer = combineReducers({
  orderBook: orderBookReducer
});

export const store = createStore(rootReducer);