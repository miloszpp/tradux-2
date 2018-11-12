import React from 'react';
import {SYMBOLS, OrderType, PutOrderPayload} from '../model';
import {Dispatch, bindActionCreators} from 'redux';
import {OrderBookAction} from '../state/reducers';
import {putOrder} from '../state/actions';
import {connect} from 'react-redux';

interface CreateOrderComponentProps {
  onCreateOrder: (payload: PutOrderPayload) => void;
}

interface CreateOrderComponentState {
  symbol: string;
  quantity: number;
  price: number;
  type: OrderType;
}

class CreateOrderComponent extends React.Component<CreateOrderComponentProps, CreateOrderComponentState> {

  emptyState = {
    symbol: SYMBOLS[0],
    quantity: 0,
    price: 0,
    type: OrderType.Ask,
  };

  constructor(props: CreateOrderComponentProps) {
    super(props);
    this.state = this.emptyState;
  }

  handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onCreateOrder(this.state);
    this.setState(this.emptyState);
  }

  handleSymbolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ symbol: event.target.value });
  }

  handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    this.setState({ quantity: isNaN(value) ? 0 : value });
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) this.setState({ price: value });
  }

  handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) this.setState({ type: value });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Symbol
          <select value={this.state.symbol} onChange={this.handleSymbolChange}>
            {SYMBOLS.map(symbol => <option key={symbol} value={symbol}>{symbol}</option>)}
          </select>
        </label>
        <label>
          Quantity
          <input type="number" value={this.state.quantity} onChange={this.handleQuantityChange} />
        </label>
        <label>
          Price
          <input type="number" value={this.state.price} onChange={this.handlePriceChange} />
        </label>
        <label>
          Type
          <select value={this.state.type} onChange={this.handleTypeChange}>
            <option value={OrderType.Bid}>Bid</option>
            <option value={OrderType.Ask}>Ask</option>
          </select>
        </label>
        <button type="submit">Add</button>
      </form>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<OrderBookAction>) => ({
  onCreateOrder: (payload: PutOrderPayload) => dispatch({ type: '@@orderbook/put', payload }),
});


export const CreateOrder = connect(null, mapDispatchToProps)(CreateOrderComponent);