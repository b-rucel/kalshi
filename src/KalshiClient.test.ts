import { describe, it, expect, beforeAll, mock, spyOn } from "bun:test";
import { KalshiClient } from "./KalshiClient";
import { generateKeyPairSync } from "node:crypto";

describe("KalshiClient", () => {
  let privateKeyPem: string;
  let client: KalshiClient;
  const keyId = "test-key-id";

  beforeAll(() => {
    const { privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });
    privateKeyPem = privateKey;
    client = new KalshiClient(keyId, privateKeyPem, true);
  });

  it("should initialize correctly", () => {
    expect(client).toBeDefined();
  });

  it("should default to production URL if isDemo is false or omitted", () => {
    const prodClient = new KalshiClient(keyId, privateKeyPem);
    // We can't access private property baseUrl easily without casting to any or using a getter if it existed.
    // For testing purposes, we can spy on fetch to see the URL it calls, or check the property via any.
    expect((prodClient as any).baseUrl).toBe("https://api.elections.kalshi.com/trade-api/v2");
  });

  describe("request", () => {
    it("should make a fetch request with correct headers", async () => {
      const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify({ success: true }))));
      global.fetch = mockFetch as any;

      await client.request("/test");

      expect(mockFetch).toHaveBeenCalled();
      const lastCall = mockFetch.mock.lastCall;
      if (!lastCall) throw new Error("Fetch was not called");
      const [url, options] = lastCall as any;

      expect(url).toContain("https://demo.kalshi.com/trade-api/v2/test");
      expect(options.headers.get("KALSHI-ACCESS-KEY")).toBe(keyId);
      expect(options.headers.get("KALSHI-ACCESS-TIMESTAMP")).toBeDefined();
      expect(options.headers.get("KALSHI-ACCESS-SIGNATURE")).toBeDefined();
    });

    it("should handle custom, non-GET methods (POST)", async () => {
      const mockFetch = mock(() => Promise.resolve(new Response(JSON.stringify({ success: true }))));
      global.fetch = mockFetch as any;

      await client.request("/order", { method: "POST", body: JSON.stringify({ id: 1 }) });

      const lastCall = mockFetch.mock.lastCall;
      const [url, options] = lastCall as any;

      expect(options.method).toBe("POST");
      expect(options.headers.get("KALSHI-ACCESS-SIGNATURE")).toBeDefined();
    });

    it("should throw error on non-ok response", async () => {
      global.fetch = mock(() => Promise.resolve(new Response("Unauthorized", { status: 401 }))) as any;

      expect(client.request("/test")).rejects.toThrow("Kalshi API Error [401]: Unauthorized");
    });
  });

  describe("getBalance", () => {
    it("should return balance", async () => {
      const mockResponse = { balance: 1000 };
      global.fetch = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse)))) as any;

      const result = await client.getBalance();
      expect(result).toEqual(mockResponse);
    });
  });

  describe("getExchangeStatus", () => {
    it("should return exchange status", async () => {
      const mockResponse = { exchange_active: true };
      global.fetch = mock(() => Promise.resolve(new Response(JSON.stringify(mockResponse)))) as any;

      const result = await client.getExchangeStatus();
      expect(result).toEqual(mockResponse);
    });
  });
});
