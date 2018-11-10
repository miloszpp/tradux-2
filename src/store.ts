import {OrderBookState, orderBookReducer} from './orderbook/state/reducers';
import {combineReducers, createStore} from 'redux';

export interface State {
  orderBook: OrderBookState;
}

export const rootReducer = combineReducers({
  orderBook: orderBookReducer
});

export const store = createStore(rootReducer);