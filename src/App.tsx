import React, { Component } from 'react';
import {Screen} from './orderbook/components/screen.component';
import {CreateOrder} from './orderbook/components/create-order.component';
import {TransactionList} from './orderbook/components/transaction-list.component';

class App extends Component {
  render() {
    return (
      <>
        <CreateOrder></CreateOrder>
        <Screen></Screen>
        <TransactionList></TransactionList>
      </>
    );
  }
}

export default App;
