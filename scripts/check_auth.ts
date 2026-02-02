import { KalshiClient } from "../src/KalshiClient";

// Load environment variables manually if not using Bun's auto-load (Bun does auto-load .env, but .env.local needs check)
// Bun automatically loads .env.local too.

const KEY_ID = process.env.KALSHI_API_KEY;
let PRIVATE_KEY = process.env.KALSHI_PRIVATE_KEY;

if (!KEY_ID || !PRIVATE_KEY) {
  console.error("Error: KALSHI_API_KEY and KALSHI_PRIVATE_KEY must be set in .env.local");
  process.exit(1);
}

const client = new KalshiClient(KEY_ID, PRIVATE_KEY);

async function main() {
  console.log("Checking authentication...");
  try {
    const balance = await client.getBalance();
    console.log("Success! Balance:", balance);
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}

main();
