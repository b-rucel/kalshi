import { KalshiClient } from "../src/KalshiClient";
import util from "util";
import { color, highlightJson, NewStyle, renderTable } from '../src/lib/terminal'

const client = new KalshiClient();

const filters = {
  politics: "Politics",
  economics: "Economics",
  climateAndWeather: "Climate and Weather",
  financials: "Financials",
  entertainment: "Entertainment",
  scienceAndTechnology: "Science and Technology",
  sports: "Sports",
  transportation: "Transportation",
  health: "Health",
  world: "World",
  crypto: "Crypto"
}

async function main() {
  try {
    console.log("Query Testing");

    const seriesResponse = await client.getSeries({ category: filters.climateAndWeather, tags: "Daily temperature" });

    const boxStyle = NewStyle()
      .border('rounded')
      .borderForeground("#F01ADE")
      .padding(1, 4)
      .width(40)
      .align(0.5); // Center align
    console.log(boxStyle.render(`Fetching ${color(seriesResponse.series.length.toString(), "mint")} ${filters.climateAndWeather} - Daily temperature series...`));


    const seriesList = seriesResponse.series;

    if (seriesList.length > 0) {
      const headers = [
        color("Ticker", "mint"),
        color("Title", "mint"),
        color("Category", "mint"),
        color("Tags", "mint")
      ];
      
      const rows = seriesList.map(s => [
        s.ticker,
        s.title,
        s.category,
        s.tags.join(", ")
      ]);

      renderTable(headers, rows, { border: "rounded", borderColor: "#F01ADE", alternateRowColor: "mint" });

      // Take the first series
      const firstSeries = seriesList[0];
      console.log(`\nSelected Series: ${color(firstSeries.title, "yellow")} (${firstSeries.ticker})`);

      // Get events for the first series
      const eventsResponse = await client.getEvents({ series_ticker: firstSeries.ticker, status: "open" });
      console.log(`Found ${color(eventsResponse.events.length.toString(), "mint")} open events.`);

      if (eventsResponse.events.length > 0) {
        // Take the first event
        const firstEvent = eventsResponse.events[0];
        console.log(`\nSelected Event: ${color(firstEvent.title, "yellow")} (${firstEvent.event_ticker})`);
        
        // Render Event Table
        const eventHeaders = [
           color("Event Ticker", "cyan"),
           color("Title", "mint"),
           color("Date", "gray")
        ];
        const eventRows = [[
           firstEvent.event_ticker,
           firstEvent.title,
           firstEvent.strike_date || "N/A"
        ]];
        renderTable(eventHeaders, eventRows, { border: "rounded", borderColor: "yellow" });

        // Get markets for this event
        console.log(`\nFetching markets for event: ${firstEvent.event_ticker}...`);
        const marketsResponse = await client.getMarkets({ event_ticker: firstEvent.event_ticker });
        const markets = marketsResponse.markets;

        if (markets && markets.length > 0) {
           // Filter markets: Only show ones with liquidity to reduce noise
           const filteredMarkets = markets.filter((m: any) => m.liquidity > 0);
           
           console.log(`Found ${color(markets.length.toString(), "mint")} total markets. Showing ${color(filteredMarkets.length.toString(), "mint")} with liquidity.`);
           
           if (filteredMarkets.length > 0) {
             const mHeaders = [
               color("Ticker", "cyan"),
               color("Title", "mint"),
               color("Bid", "green"),
               color("Ask", "red"),
               color("Last", "yellow"),
               color("Liq", "blue"),
               color("Vol", "magenta"),
               color("Open", "gray"),
               color("Close", "gray")
             ];

             const mRows = filteredMarkets.map((m: any) => [
               m.ticker.split('-').at(-1) || m.ticker,
               m.title,
               m.yes_bid.toString(),
               m.yes_ask.toString(),
               m.last_price.toString(),
               m.liquidity.toString(),
               m.volume.toString(),
               m.open_time || "N/A",
               m.close_time || "N/A"
             ]);

             renderTable(mHeaders, mRows, { border: "rounded", borderColor: "cyan", alternateRowColor: "darkGray" });
           } else {
             console.log(color("No markets with liquidity found for this event.", "yellow"));
           }
        } else {
           console.log(color("No markets found for this event.", "red"));
        }

      } else {
        console.log(color("No open events found for this series.", "red"));
      }

    } else {
      console.log(color("No series found matching criteria.", "red"));
    }





    // let cursor: string | undefined;
    // const allMarkets: any[] = [];
    // let pageCount = 0;

    // do {
    //   pageCount++;
    //   const response: any = await client.getMarkets({
    //     limit: 100,
    //     cursor: cursor
    //   });

    //   const markets = response.markets;
    //   allMarkets.push(...markets);

    //   console.log(`Page ${pageCount}: Fetched ${color(markets.length.toString(), "mint")} markets. (Total: ${allMarkets.length})`);

    //   cursor = response.cursor;

    // } while (cursor);

    // console.log(`\nFinished! Found a total of ${color(allMarkets.length.toString(), "yellow")} markets across ${pageCount} pages.`);

    // if (allMarkets.length > 0) {
    //   console.log("First market example:");
    //   console.log(highlightJson(allMarkets[0]));
    // }

  } catch (error) {
    console.error("Error querying markets:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

