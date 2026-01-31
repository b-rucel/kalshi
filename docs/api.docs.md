
# kalshi api docs

https://docs.kalshi.com/welcome

- public
curl -ks --request GET \
  --url 'https://api.elections.kalshi.com/trade-api/v2/markets?limit=100'

other endpoints will require an API key
use .env.local to store the API key



## Rate Limits
These limits apply to the Basic (free) tier with an API key.
- **Read**: 20 requests per second
- **Write**: 10 requests per second



## api groups

https://docs.kalshi.com/api-reference/

- exchange
  - GetExchangeStatus
  - GetExchangeAnnouncements
  - GetSeriesFeeChanges
  - GetExchangeSchedule
  - GetUserDataTimestamp

- orders
  - GetOrders
  - CreateOrder
  - GetOrder
  - CancelOrder
  - BatchCreateOrders
  - BatchCancelOrders
  - AmendOrder
  - DecreaseOrder
  - GetQueuePositionsForOrders
  - GetOrderQueuePosition

- order-groups
  - GetOrderGroups
  - CreateOrderGroup
  - GetOrderGroup
  - DeleteOrderGroup
  - ResetOrderGroup
  - TriggerOrderGroup
  - UpdateOrderGroupLimit

- portfolio
  - GetBalance
  - CreateSubaccount
  - TransferBetweenSubaccounts
  - GetAllSubaccountBalances
  - GetSubaccountTransfers
  - GetPositions
  - GetSettlements
  - GetTotalRestingOrderValue
  - GetFills

- api-keys
  - GetAPIKeys
  - CreateAPIKey
  - GenerateAPIKey
  - DeleteAPIKey

- search
  - GetTagsForSeriesCategories
  - GetFiltersForSports

- account
  - GetAccountAPILimits

- market
  - GetMarketCandlesticks
  - GetTrades
  - GetMarketOrderbook
  - GetSeries
  - GetSeriesList
  - GetMarkets
  - GetMarket
  - BatchGetMarketCandlesticks

- events
  - GetEventCandlesticks
  - GetEvents
  - GetMultivariateEvents
  - GetEvent
  - GetEventMetadata
  - GetEventForecastPercentileHistory

- live-data
  - GetLiveData
  - GetMultipleLiveData

- incentive-programs
  - GetIncentives

- fcm
  - GetFCMOrders
  - GetFCMPositions

- structured-targets
  - GetStructuredTargets
  - GetStructuredTarget

- milestone
  - GetMilestone
  - GetMilestones

- communications
  - GetCommunicationsID
  - GetRFQs
  - CreateRFQ
  - GetRFQ
  - DeleteRFQ
  - GetQuotes
  - CreateQuote
  - GetQuote
  - DeleteQuote
  - AcceptQuote
  - ConfirmQuote

- multivariate
  - GetMultivariateEventCollection
  - CreateMarketInMultivariateEventCollection
  - GetMultivariateEventCollections
  - GetMultivariateEventCollectionLookupHistory
  - LookupTickersForMarketInMultivariateEventCollection


