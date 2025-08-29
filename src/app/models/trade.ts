export interface TradeStatusUpdate {
  tradeId: string;
  timestamp: Date;
  status: string;
  errorMessage?:string;
  batchId: number;
  correationId: number
}

export interface Trade extends TradeStatusUpdate {
  symbol: string;
  quantity: number;
  price: number;
  side: string;
  traderId: string;
  tradeDate: Date;
  createdAt: Date;
  updatedAt: Date
}
