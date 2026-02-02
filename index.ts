import { Renderer, listen, color, NewStyle, stopListening, joinHorizontal, joinVertical, Top, Left, renderTable } from "./src/lib/terminal";
import { KalshiClient } from "./src/KalshiClient";

const renderer = new Renderer();
const client = new KalshiClient();

// State
let selectedIndex = 0;
let items: any[] = []; // Store full series objects
let loading = true;
let running = true;
let error: string | null = null;
let events: { event: any, markets: any[] }[] = [];
let loadingEvents = false;
let selectedSeriesTicker: string | null = null;

// Setup
renderer.enterAltScreen();

function render() {
  renderer.clear();

  // Draw Title
  renderer.write(2, 1, NewStyle().bold().foreground("cyan").render("Kalshi TUI Demo"));
  renderer.write(2, 2, color("Use Up/Down to navigate, 'Enter' to view events, 'q' to exit", "gray"));

  if (loading) {
    renderer.write(2, 4, color("Loading series data...", "yellow"));
    renderer.flush();
    return;
  }

  if (error) {
    renderer.write(2, 4, color(`Error: ${error}`, "red"));
    renderer.flush();
    return;
  }

  // --- Left Panel: Series List ---
  const maxDisplay = 20;
  const start = 0;
  const end = Math.min(start + maxDisplay, items.length);
  const seriesLines: string[] = [];

  // Header for Left Panel
  // Define column widths for Series Table
  const colTicker = 12;
  const colCategory = 18;
  // Remaining for Title
  const colTitle = 30;

  // Header Row
  const headerStr =
    color("Ticker".padEnd(colTicker), "cyan") +
    color("Category".padEnd(colCategory), "magenta") +
    color("Title".padEnd(colTitle), "mint");

  seriesLines.push(NewStyle().bold().underline().render("Series List"));
  seriesLines.push(headerStr);
  seriesLines.push(color("-".repeat(colTicker + colCategory + colTitle), "gray"));

  for (let i = start; i < end; i++) {
    const item = items[i];
    if (!item) continue;
    const isSelected = i === selectedIndex;
    const prefix = isSelected ? "> " : "  "; // Prefix is outside the table columns or inside? 
    // Let's put prefix before the line, but it might mess up alignment if not careful.
    // Or handle selection by background color of the whole line.

    // Format columns
    const ticker = (item.ticker || "").substring(0, colTicker - 1).padEnd(colTicker);
    const category = (item.category || "").substring(0, colCategory - 1).padEnd(colCategory);
    const titleRaw = item.title || "";
    const title = titleRaw.substring(0, colTitle).padEnd(colTitle);

    let lineContent = ticker + category + title;

    let style = NewStyle();
    if (isSelected) {
      style = style.background("blue").foreground("white").bold();
      // lineContent = "> " + lineContent.substring(2); // Adjust for prefix?
      // Actually, let's just highlight the row and use a simple marker strictly inside or just rely on color.
      // Using a prefix char makes it clear.
      lineContent = prefix + lineContent;
    } else {
      style = style.foreground("white");
      lineContent = prefix + lineContent;
    }
    seriesLines.push(style.render(lineContent));
  }

  const leftContent = seriesLines.join("\n");
  const leftBlock = NewStyle()
    .border("rounded")
    .borderForeground("cyan")
    .padding(0, 1)
    .width(70) // Increased width for table
    .render(leftContent);

  // --- Right Panel: Events List ---
  const eventLines: string[] = [];
  if (selectedSeriesTicker) {
    eventLines.push(NewStyle().bold().underline().render(`Events for ${selectedSeriesTicker}`));
    if (loadingEvents) {
      eventLines.push(color("Loading events...", "yellow"));
    } else if (events.length === 0) {
      eventLines.push(color("No open events found.", "gray"));
    } else {
      // Show first 3 events with markets to fit screen
      events.slice(0, 3).forEach(eItem => {
        const e = eItem.event;
        eventLines.push(color(`• ${e.title} (${e.event_ticker})`, "mint"));
        eventLines.push(color(`  Date: ${e.strike_date}`, "gray"));

        if (eItem.markets && eItem.markets.length > 0) {
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
          // Reduce rows shown per event to save space
          const mRows = eItem.markets.slice(0, 3).map((m: any) => [
            m.ticker.split('-').at(-1) || m.ticker,
            (m.title || ""),
            // .substring(0, 15) + "...", // Truncate title
            m.yes_bid.toString(),
            m.yes_ask.toString(),
            m.last_price.toString(),
            m.liquidity.toString(),
            m.volume.toString(),
            (m.open_time || "").split('T')[1]?.substring(0, 5) || "N/A", // Shorten time
            (m.close_time || "").split('T')[1]?.substring(0, 5) || "N/A"
          ]);

          const tableStr = renderTable(mHeaders, mRows, {
            border: "rounded",
            borderColor: "gray",
            returnString: true
          });

          if (tableStr) {
            eventLines.push(tableStr as string);
          }
        } else {
          eventLines.push(color("  No markets", "gray"));
        }
        eventLines.push(""); // Spacer
      });
    }
  } else {
    eventLines.push(color("Select a series and press Enter", "gray"));
  }

  const rightContent = eventLines.join("\n");
  const rightBlock = NewStyle()
    .border("rounded")
    .borderForeground("magenta")
    .padding(0, 1)
    .width(90) // Increased width for larger market table
    .render(rightContent);

  // --- Combine Panels ---
  // Start drawing at line 4
  const mainContent = joinHorizontal(Top, 2, leftBlock, rightBlock);

  // --- Footer Status ---
  const statusText = loading ? "Fetching..." : (error ? "Failed" : `Selected: ${items[selectedIndex]?.ticker || "None"}`);
  const footerBlock = NewStyle()
    .border("rounded")
    .borderForeground("yellow")
    .padding(0, 1)
    .width(70) // Half width roughly
    .render(color(statusText, "yellow"));

  const finalLayout = joinVertical(Left, 0, mainContent, footerBlock);

  const lines = finalLayout.split('\n');
  lines.forEach((line: string, i: number) => {
    renderer.write(2, 4 + i, line);
  });

  renderer.flush();
}

// Initial Render
render();

// Data Fetching
async function fetchData() {
  try {
    // Replicating query from query.ts
    const filters = {
      climateAndWeather: "Climate and Weather"
    };
    const seriesResponse = await client.getSeries({ category: filters.climateAndWeather, tags: "Daily temperature" });
    items = seriesResponse.series;

    loading = false;
    render(); // Re-render with data
  } catch (e: any) {
    loading = false;
    error = e.message || "Unknown error";
    render();
  }
}

fetchData();

// Input Handling
listen((key) => {
  if (!running) return;

  if (key.name === 'q') {
    running = false;
    cleanup();
    return;
  }

  if (loading || error || items.length === 0) return; // Disable nav while loading or empty

  if (key.name === 'up') {
    selectedIndex--;
    if (selectedIndex < 0) selectedIndex = items.length - 1;
    render();
  }

  if (key.name === 'down') {
    selectedIndex++;
    if (selectedIndex >= items.length) selectedIndex = 0;
    render();
  }

  if (key.name === 'return' || key.name === 'enter') {
    const item = items[selectedIndex];
    if (item) {
      selectedSeriesTicker = item.ticker;
      loadingEvents = true;
      events = [];
      render(); // show loading state

      // Fetch events and markets
      client.getEvents({ series_ticker: item.ticker, status: "open" })
        .then(async (resp) => {
          const fetchedEvents = resp.events;
          const eventsWithMarkets: any[] = [];

          // Fetch markets for each event (limited to first 5 to avoid rate limits/spam)
          // Sequential for simplicity
          for (const evt of fetchedEvents.slice(0, 5)) {
            try {
              const mktsResp = await client.getMarkets({ event_ticker: (evt as any).event_ticker });
              // Filter for liquidity if desired, or just take first few
              const mkts = mktsResp.markets.filter((m: any) => m.liquidity > 0);
              eventsWithMarkets.push({ event: evt, markets: mkts });
            } catch (e) {
              eventsWithMarkets.push({ event: evt, markets: [] });
            }
          }

          events = eventsWithMarkets;
          loadingEvents = false;
          render();
        })
        .catch(err => {
          loadingEvents = false;
          render();
        });
    }
  }
});

function cleanup() {
  stopListening();
  renderer.exitAltScreen();
  console.log("Exited TUI.");
  process.exit(0);
}
