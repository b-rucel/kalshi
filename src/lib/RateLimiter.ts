export class RateLimiter {
  private timestamps: number[] = [];
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit: number, windowMs: number = 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async wait(): Promise<void> {
    while (true) {
      const now = Date.now();
      // Clean up old timestamps
      while (this.timestamps.length > 0 && this.timestamps[0] <= now - this.windowMs) {
        this.timestamps.shift();
      }

      if (this.timestamps.length < this.limit) {
        this.timestamps.push(now);
        return;
      }

      // Wait for the oldest timestamp to expire
      const oldest = this.timestamps[0];
      const waitTime = oldest + this.windowMs - now;
      if (waitTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }
}
