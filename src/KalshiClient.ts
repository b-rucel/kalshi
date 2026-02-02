import { generateSignature } from "./auth";
import { RateLimiter } from "./lib/RateLimiter";

export class KalshiClient {
  private baseUrl: string;
  private keyId: string;
  private privateKey: string;
  private readLimiter: RateLimiter;
  private writeLimiter: RateLimiter;

  constructor(keyId?: string, privateKey?: string, isDemo = false, options?: { readLimit?: number; writeLimit?: number }) {
    const finalKeyId = keyId ?? process.env.KALSHI_API_KEY;
    const finalPrivateKey = privateKey ?? process.env.KALSHI_PRIVATE_KEY;

    if (!finalKeyId || !finalPrivateKey) {
      throw new Error("Kalshi credentials missing. Provide them in constructor or set KALSHI_API_KEY and KALSHI_PRIVATE_KEY env vars.");
    }

    this.keyId = finalKeyId.trim();
    this.privateKey = finalPrivateKey.trim();

    console.log(`Initialized with KeyID: ${this.keyId.substring(0, 10)}...`);
    this.baseUrl = isDemo
      ? "https://demo.kalshi.com/trade-api/v2"
      : "https://api.elections.kalshi.com/trade-api/v2";

    // Default limits: 20 reads/sec, 10 writes/sec (Basic Tier)
    this.readLimiter = new RateLimiter(options?.readLimit ?? 20);
    this.writeLimiter = new RateLimiter(options?.writeLimit ?? 10);
  }

  /**
   * Generic request method that handles signing
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || "GET";

    // Apply rate limiting
    if (method === "GET") {
      await this.readLimiter.wait();
    } else {
      await this.writeLimiter.wait();
    }

    const timestamp = Date.now();

    // Path for signature must be the full path component, e.g., /trade-api/v2/portfolio/balance
    // Since our baseUrl includes /trade-api/v2, we need to be careful.
    // Let's assume the 'path' argument passed to this function is relative to the API root (e.g., '/portfolio/balance')
    // But the signature requires the full path on the server.

    const url = new URL(this.baseUrl + path);
    const signaturePath = url.pathname; // This extracts '/trade-api/v2/portfolio/balance' correctly
    // console.log(`Signing: ${timestamp} ${method} ${signaturePath}`);

    // Generate Signature
    const signature = await generateSignature(
      timestamp,
      method,
      signaturePath,
      this.privateKey
    );

    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");
    headers.set("KALSHI-ACCESS-KEY", this.keyId);
    headers.set("KALSHI-ACCESS-TIMESTAMP", timestamp.toString());
    headers.set("KALSHI-ACCESS-SIGNATURE", signature);

    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Kalshi API Error [${response.status}]: ${text}`);
    }

    return response.json() as Promise<T>;
  }

  async getBalance() {
    return this.request<{ balance: number }>("/portfolio/balance");
  }

  async getExchangeStatus() {
    // Public endpoint, but can still be signed without issue usually.
    return this.request<{ exchange_active: boolean }>("/exchange/status");
  }

  /**
   * Retrieves market data.
   * https://docs.kalshi.com/api-reference/market/get-markets
   * 
   * @param params.limit - integer (1-1000, default 100)
   * @param params.cursor - string
   * @param params.status - enum (active, closed, settled)
   * @param params.event_ticker - string
   * @param params.series_ticker - string
   * @param params.max_close_ts - integer (unix seconds)
   * @param params.min_close_ts - integer (unix seconds)
   * @param params.ticker - string
   */
  async getMarkets(params: { limit?: number; cursor?: string; status?: string; event_ticker?: string } = {}) {
    const query = new URLSearchParams();
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.status) query.set("status", params.status);
    if (params.event_ticker) query.set("event_ticker", params.event_ticker);

    return this.request<{ markets: import("./types").Market[]; cursor?: string }>(
      `/markets?${query.toString()}`
    );
  }


  /**
   * Retrieves series data.
   * - If category is provided, it filters the list of series by category.
   *
   * Note: This currently calls the list endpoint (/series) with query parameters.
   * https://docs.kalshi.com/api-reference/market/get-series-list
   *
   * this one does not take series_ticker as a parameter, need to remove
   *
   * @param params.category - Filter by category
   * @param params.tags - Filter by tags
   * @returns List of series and optional pagination cursor
   */
  async getSeries(params: { category?: string; tags?: string } = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.tags) query.set("tags", params.tags);
    return this.request<{ series: import("./types").Series[]; cursor?: string }>(
      `/series?${query.toString()}`
    );
  }


  /**
   * Retrieves events from Kalshi.
   * https://docs.kalshi.com/api-reference/events/get-events
   *
   * @param params.series_ticker - Filter by series (e.g., 'HIGHNY')
   * @param params.status - Filter by status ('open', 'closed', 'settled')
   * @param params.limit - Max events to return (1-200, default 200)
   * @param params.cursor - Pagination cursor
   * @param params.min_close_ts - Filter events closing after this Unix timestamp (seconds)
   * @param params.with_nested_markets - If true, includes market data within each event object
   * @param params.with_milestones - If true, includes milestone data
   * @returns List of events and optional pagination cursor
   *
   */
  async getEvents(params: {
    series_ticker?: string;
    status?: string;
    limit?: number;
    cursor?: string;
    min_close_ts?: number;
    with_nested_markets?: boolean;
    with_milestones?: boolean;
  } = {}) {
    const query = new URLSearchParams();
    if (params.series_ticker) query.set("series_ticker", params.series_ticker);
    if (params.status) query.set("status", params.status);
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.cursor) query.set("cursor", params.cursor);
    if (params.min_close_ts) query.set("min_close_ts", params.min_close_ts.toString());
    if (params.with_nested_markets) query.set("with_nested_markets", params.with_nested_markets.toString());
    if (params.with_milestones) query.set("with_milestones", params.with_milestones.toString());

    return this.request<{ events: import("./types").Event[]; cursor?: string }>(
      `/events?${query.toString()}`
    );
  }
}
