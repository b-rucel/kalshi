export interface ExchangeStatus {
  exchange_active: boolean;
  trading_active: boolean;
}

export interface Market {
  ticker: string;
  event_ticker: string;
  subtitle: string;
  short_name: string;
  expiration_time: string; // ISO timestamp
  status: string;
  yes_bid: number;
  yes_ask: number;
  last_price: number;
  volume: number;
  open_interest: number;
  liquidity: number;
}

export interface BalanceResponse {
  balance: number;
}
