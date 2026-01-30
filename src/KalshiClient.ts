import { generateSignature } from "./auth";

export class KalshiClient {
  private baseUrl: string;
  private keyId: string;
  private privateKey: string;

  constructor(keyId: string, privateKey: string, isDemo = false) {
    this.keyId = keyId.trim();
    this.privateKey = privateKey.trim();
    console.log(`Initialized with KeyID: ${this.keyId.substring(0, 10)}...`);
    this.baseUrl = isDemo
      ? "https://demo.kalshi.com/trade-api/v2"
      : "https://api.elections.kalshi.com/trade-api/v2";
  }

  /**
   * Generic request method that handles signing
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || "GET";
    const timestamp = Date.now();
    
    // Path for signature must be the full path component, e.g., /trade-api/v2/portfolio/balance
    // Since our baseUrl includes /trade-api/v2, we need to be careful.
    // Let's assume the 'path' argument passed to this function is relative to the API root (e.g., '/portfolio/balance')
    // But the signature requires the full path on the server.
    
    const url = new URL(this.baseUrl + path);
    const signaturePath = url.pathname; // This extracts '/trade-api/v2/portfolio/balance' correctly

    console.log(`Signing: ${timestamp} ${method} ${signaturePath}`);

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
}
