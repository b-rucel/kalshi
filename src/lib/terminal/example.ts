import { NewStyle, renderTable, RoundedBorder, color } from "./index";

/**
 * Example 1: Basic Text Styling
 */
console.log(NewStyle().foreground("#04B575").bold(true).render("--- Example 1: Basic Styling ---"));
const simpleStyle = NewStyle()
  .foreground("#802922")
  .background("#00BFAE")
  .padding(0, 2)
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
