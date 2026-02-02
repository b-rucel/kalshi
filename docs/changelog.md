# Changelog

All notable changes to this project will be documented in this file.

## [0.0.2] - 2026-02-01

### Added
- **Core SDK**:
  - Implemented `KalshiClient` with secure authentication and request signing.
  - Added `RateLimiter` to handle API rate limits gracefully.
  - Added comprehensive types for Markets, Series, and Events in `src/types.ts`.
- **API Methods**:
  - `getMarkets`: Support for `limit`, `cursor`, `status`, `event_ticker`, and timestamp filtering.
  - `getSeries`: Support for category and tag filtering.
  - `getEvents`: Support for nested markets, milestones, and status filtering.
- **CLI Tools**:
  - Created a custom terminal UI library in `src/lib/terminal` (tables, colors, borders).
  - Added `scripts/query.ts` for interactive market exploration and data visualization.
  - Added `scripts/check_auth.ts` for verifying API credentials.
- **Documentation**:
  - Added `docs/api.docs.md` detailing available API endpoints and parameters.
  - Added `docs/concepts.md` explaining data fetching strategies ("Drill-Down" vs "Market Scanner").

### Changed
- Refactored `KalshiClient` to support pagination cursors in responses.
- Updated `README.md` with usage instructions.

## [0.0.1] - 2026-01-29

### Added
- Initial project setup with Bun and TypeScript.
