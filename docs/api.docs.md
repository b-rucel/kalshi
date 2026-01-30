
# kalshi api docs

https://docs.kalshi.com/welcome

- public
curl -ks --request GET \
  --url 'https://api.elections.kalshi.com/trade-api/v2/markets?limit=100'

other endpoints will require an API key
use .env.local to store the API key


## Relevant Endpoints

### Exchange Status
*   `GET /exchange/status`: Check if the exchange is active and trading is enabled.
*   `GET /exchange/schedule`: Get the exchange trading schedule.

### Market Discovery & Data
These endpoints are used to find markets (e.g., Weather) and get their static details.

*   `GET /market/markets`: List all markets. This is the primary endpoint for filtering by category (e.g., "Weather") or series.
*   `GET /market/market`: Get specific details for a single market by its ticker.
*   `GET /market/series`: Get details about a series (a collection of related markets).
*   `GET /events/events`: Get high-level events (which may contain multiple markets).
*   `GET /events/event`: Get details for a specific event.

### Market Activity & Prices
These endpoints provide dynamic data like current prices, order books, and historical data.

*   `GET /market/orderbook`: Get the current order book (bids and asks) for a market. Essential for determining liquidity and price.
*   `GET /market/candlesticks`: Get historical OHLCV (Open, High, Low, Close, Volume) data for a market.
*   `GET /market/trades`: Get recent trades for a market.
*   `GET /market/batch-candlesticks`: Efficiently fetch history for multiple markets.

### Trading
Endpoints for executing trades.

*   `POST /orders/create-order`: Place a new order (limit or market).
*   `GET /orders/orders`: List open and past orders.
*   `GET /orders/order`: Get details of a specific order.
*   `DELETE /orders/cancel-order`: Cancel an open order.
*   `POST /orders/batch-create-orders`: Place multiple orders at once (useful for strategies).
*   `DELETE /orders/batch-cancel-orders`: Cancel multiple orders at once.
*   `POST /orders/amend-order`: Modify an existing order.

### Portfolio & Account
Endpoints for managing the bot's funds and positions.

*   `GET /portfolio/balance`: Get the current available balance.
*   `GET /portfolio/positions`: Get current open positions in markets.
*   `GET /portfolio/fills`: Get a history of filled trades.
*   `GET /portfolio/settlements`: Get history of settled markets (payouts).

