# Kalshi Concepts & Hierarchy

Understanding the relationship between Markets, Events, and Series is crucial for navigating the API.

## Hierarchy Overview

**Series** (Theme) -> **Event** (Date/Instance) -> **Market** (Specific Outcome)

### 1. Series
The highest level of organization. A Series groups related events that repeat or share a common theme.
- **Analogy**: A TV Show (e.g., "Game of Thrones").
- **Example**: "Fed Interest Rate Decisions" or "Daily S&P 500 Close".

### 2. Event
A specific occurrence within a series, usually tied to a specific date, deadline, or report release. An event contains one or more markets.
- **Analogy**: A specific Episode of that TV show.
- **Example**: "Fed Interest Rate Decision for **March 2024**".
- **API**: Retrieves data about the event itself (ticker, start date, etc).

### 3. Market
The specific tradable contract with a definitive Yes/No outcome. This is the atomic unit where trading occurs.
- **Analogy**: A specific Scene or question about that episode ("Did Character X die?").
- **Example**: "Will the Fed hike rates by **25bps**?" vs "Will the Fed hike rates by **50bps**?".
- **API**: Used for order book data, placing orders, and getting candlestick data.

## Recommended Navigation Workflow

### 1. Browse by Series (The "Netflix" approach)
Start here if you are looking for a *topic*.
- Get all Series (e.g., "Economics", "Weather").
- **Why**: This filters out the noise. You don't want to see 500 individual "Daily High Temp" markets; you want to see the "Weather" series first.

### 2. Drill into Events (The "Episode" selection)
Once you have a Series (e.g., "Fed Rates"), look at the Events.
- **Why**: Events group markets by time or report. (e.g., "Fed Meeting March" vs "Fed Meeting May").
- Pick the timeframe that interests you.

### 3. Select Market (The specific bet)
Inside the Event, you will see multiple Markets (Strike prices).
- **Why**: This is where you pick your risk/reward.
- Example: "Greater than 5.0%" (Safe) vs "Greater than 6.0%" (Risky).

## Available Series Categories
Based on API exploration:
- Politics
- Economics
- Climate and Weather
- Financials
- Entertainment
- Science and Technology
- Sports
- Transportation
- Health
- World
- Crypto
