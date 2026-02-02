import { describe, expect, test, beforeAll, afterAll } from "bun:test";
import { RateLimiter } from "./RateLimiter";

describe("RateLimiter", () => {
  test("allows requests under the limit immediately", async () => {
    const limit = 5;
    const limiter = new RateLimiter(limit, 1000);
    const start = Date.now();

    for (let i = 0; i < limit; i++) {
      await limiter.wait();
    }

    const end = Date.now();
    // Should happen almost instantly, definitely under 50ms
    expect(end - start).toBeLessThan(50);
  });

  test("throttles requests over the limit", async () => {
    const limit = 2;
    const windowMs = 200;
    const limiter = new RateLimiter(limit, windowMs);
    
    const start = Date.now();

    // First 2 should be instant
    await limiter.wait();
    await limiter.wait();

    // 3rd should wait ~200ms
    await limiter.wait();
    
    const end = Date.now();
    const duration = end - start;

    expect(duration).toBeGreaterThanOrEqual(windowMs - 20); // allow slight jitter
    expect(duration).toBeLessThan(windowMs + 100);
  });

  test("handles concurrent requests", async () => {
    const limit = 1;
    const windowMs = 100;
    const limiter = new RateLimiter(limit, windowMs);
    const start = Date.now();

    // Launch 3 requests in parallel
    await Promise.all([
        limiter.wait(),
        limiter.wait(),
        limiter.wait()
    ]);

    const end = Date.now();
    // The first is instant (0ms). 
    // The second waits for the first to expire (~100ms).
    // The third waits for the second to expire (~200ms).
    // Total time should be roughly 200ms.
    const duration = end - start;

    expect(duration).toBeGreaterThanOrEqual(windowMs * 2 - 20);
    expect(duration).toBeLessThan(windowMs * 2 + 100);
  });
});
