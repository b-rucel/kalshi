export interface ExchangeStatus {
  exchange_active: boolean;
  trading_active: boolean;
}

export interface Market {
  ticker: string;
  event_ticker: string;
  subtitle: string;
  title: string;
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

export interface Series {
  ticker: string;
  title: string;
  frequency: string;
}

export interface Event {
  ticker: string;
  series_ticker: string;
  title: string;
  sub_title: string;
  category: string;
  mutually_exclusive: boolean;
  event_date_iso: string; // ISO 8601
}
