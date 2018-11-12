export enum OrderType {
  Bid,
  Ask
};

export interface Order {
  id: number;
  symbol: string;
  price: number;
  quantity: number;
  type: OrderType;
  timestamp: Date;
}

export interface Transaction {
  activeOrderId: number;
  passiveOrderId: number;
  timestamp: Date;
  quantity: number;
  price: number;
  symbol: string;
}

export interface OrderBook {
  orders: Order[];
  transactions: Transaction[];
}

export interface OrderScreenSymbol {
  bid: Order[],
  ask: Order[],
}

export interface OrderScreen {
  [symbol: string]: OrderScreenSymbol,
}

export interface PutOrderPayload {
  symbol: string;
  price: number;
  quantity: number;
  type: OrderType;
}

export const SYMBOLS = ['GOOG', 'AAPL', 'MSFT'];