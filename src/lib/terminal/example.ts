import { NewStyle, renderTable, RoundedBorder, color, rainbow, rgb } from "./index";


console.log(color("\nThe Most Basic Text Coloring - No Spacing\n", "emerald"))

/**
 * Example 1: Basic Text Styling
 */
console.log(NewStyle().foreground("#04B575").bold(true).render("--- Example 1: Basic Styling ---"));

const simpleStyle = NewStyle()
  .foreground("#802922")
  .background("#00BFAE")
  .padding(1, 4)
  .margin(0, 1);
console.log(simpleStyle.render("Hello, Kalshi Terminal!"));

/**
 * Example 2: Borders and Alignment
 */
console.log(NewStyle().foreground("#04B575").bold(true).marginTop(1).render("--- Example 2: Borders and Alignment ---"));
const boxStyle = NewStyle()
  .border(RoundedBorder)
  .borderForeground("#F01ADE")
  .padding(1, 4)
  .width(40)
  .align(0.5); // Center align

console.log(boxStyle.render("This text is centered\ninside a magenta box."));

/**
 * Example 3: Advanced Table with Custom Styling
 */
console.log(NewStyle().foreground("#04B575").bold(true).marginTop(1).render("--- Example 3: Table with Manual Content Styling ---"));

const headers = ["ID", "MARKET", "PROBABILITY"].map(h =>
  NewStyle().foreground("#04B575").bold(true).render(h)
);

const rows = [
  ["1", "Will it rain today?", color("15%", 31)],
  ["2", "Will Bitcoin hit $100k?", color("85%", 32)],
  ["3", "Will AI take over?", color("50%", 33)],
];

renderTable(headers, rows, {
  border: "rounded",
  borderColor: "#30BFEB"
});

/**
 * Example 4: Margin and Padding demo
 */
console.log(NewStyle().foreground("#04B575").bold(true).marginTop(1).render("--- Example 4: Margin and Padding Demo ---"));

const inner = NewStyle()
  .background("#FF5F00")
  .foreground("#FFFFFF")
  .padding(1, 2)
  .render("Inner Content");

const outer = NewStyle()
  .border(RoundedBorder)
  .padding(1)
  .margin(1)
  .render(inner);

console.log(outer);

/**
 * Example 5: ChromaWave Extended Colors
 */
console.log(NewStyle().foreground("gold").bold(true).marginTop(1).render("--- Example 5: Extended Color Palette ---"));
const palette = [
  ["coral", "peach", "salmon", "rose"],
  ["mint", "lime", "emerald", "green"],
  ["sky", "blue", "sapphire", "indigo"],
  ["lavender", "violet", "magenta", "purple"]
];

for (const row of palette) {
  console.log(row.map(c => color(` ${c.padEnd(10)} `, c)).join(" "));
}
console.log("");

/**
 * Example 6: Rainbow Gradients
 */
console.log(NewStyle().foreground("sky").bold(true).render("--- Example 6: Rainbow Gradients ---"));
console.log(rainbow("The quick brown fox jumps over the lazy dog", 0.1));
console.log(rainbow("The quick brown fox jumps over the lazy dog", 0.3));
console.log(rainbow("The quick brown fox jumps over the lazy dog", 0.5));
console.log("");

/**
 * Example 7: Colored Tables & Borders
 */
console.log(NewStyle().foreground("mint").bold(true).render("--- Example 7: Colored Tables & Borders ---"));
const coloredHeaders = ["Coin", "Price", "Change"].map(h => color(h, "gold"));
const coloredRows = [
  ["Bitcoin", "$98,000", color("+5.2%", "green")],
  ["Ethereum", "$2,800", color("+1.4%", "mint")],
  ["Solana", "$145", color("-0.5%", "crimson")],
];

renderTable(coloredHeaders, coloredRows, {
  border: "rounded",
  borderColor: "teal"
});

console.log("");
console.log(NewStyle()
  .borderStyle('double')
  .borderForeground("violet")
  .padding(1, 4)
  .align(0.5)
  .foreground("white")
  .render(rainbow("   ChromaWave Is Awesome!   ", 0.2))
);
console.log("");
