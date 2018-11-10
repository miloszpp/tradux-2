import React from 'react';
import {Order} from '../state/types';
import {keysIn, head} from 'ramda';
import {connect} from 'react-redux';
import {screenSelector} from '../state/selectors';
import {State} from '../state/reducers';

export interface ScreenProps {
  orders: {
    [symbol: string]: {
      bid: Order[],
      ask: Order[],
    }
  }
}

const screenComponent: React.SFC<ScreenProps> = (props: ScreenProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Bid</th>
          <th>Ask</th>
        </tr>
      </thead>
      <tbody>
        {keysIn(props.orders).map((symbol) => <tr key={symbol}>
          <td>{symbol}</td>
          <td>{singleOrder(props.orders[symbol].bid)}</td>
          <td>{singleOrder(props.orders[symbol].ask)}</td>
        </tr>)}
      </tbody>
    </table>
  );
};

function singleOrder(orders: Order[]) {
  const first = head(orders);
  return first ? first.price : '-';
}

const mapStateToProps = (state: State) => {
  return {
    orders: screenSelector(state)
  };
};

export const ScreenComponent = connect(mapStateToProps)(screenComponent);