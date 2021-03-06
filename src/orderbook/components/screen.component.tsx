import React from 'react';
import {Order, OrderScreen} from '../model';
import {keysIn, head} from 'ramda';
import {connect} from 'react-redux';
import {getScreen} from '../state/selectors';
import {State} from '../../store';

export interface ScreenProps {
  screen: OrderScreen;
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
        {keysIn(props.screen).map((symbol) => <tr key={symbol}>
          <td>{symbol}</td>
          <td>{renderFirst(props.screen[symbol].bid)}</td>
          <td>{renderFirst(props.screen[symbol].ask)}</td>
        </tr>)}
      </tbody>
    </table>
  );
};

function renderFirst(orders: Order[]) {
  const first = head(orders);
  return first ? `${first.price} (${first.quantity})` : '-';
}

const mapStateToProps = (state: State): ScreenProps => {
  return {
    screen: getScreen(state)
  };
};

export const Screen = connect(mapStateToProps)(screenComponent);