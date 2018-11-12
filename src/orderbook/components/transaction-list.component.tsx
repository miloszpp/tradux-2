import React from 'react';

import {Transaction} from '../model';
import {State} from '../../store';
import {getTransactions} from '../state/selectors';
import {connect} from 'react-redux';

export interface TransactionListProps {
  transactions: Transaction[];
}

const transactionListComponent: React.SFC<TransactionListProps> = (props: TransactionListProps) => (
    <table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {props.transactions.map(transaction => 
          <tr key={+transaction.timestamp}>
            <td>{transaction.symbol}</td>
            <td>{transaction.price}</td>
            <td>{transaction.quantity}</td>
            <td>{transaction.timestamp.toLocaleString()}</td>
          </tr>
        )}
      </tbody>
    </table>
);

const mapStateToProps = (state: State): TransactionListProps => {
  return {
    transactions: getTransactions(state)
  };
};

export const TransactionList = connect(mapStateToProps)(transactionListComponent);