# Terminal Library

A lightweight, zero-dependency library for building beautiful terminal user interfaces (TUIs) in TypeScript.

## Features

- 🎨 **Rich Color System**: 24-bit TrueColor support, 30+ named colors, hex codes, and rainbow gradients.
- 💅 **Style System**: Chainable API for borders, padding, margins, and alignment.
- 📊 **Tables**: Auto-formatting tables with customizable borders and colors.
- 🧱 **Border System**: Pre-defined border styles (rounded, double, thick, etc.).

## Installation

```typescript
import { NewStyle, color, rainbow, renderTable } from "./src/lib/terminal";
```

## Color System

### Basic Usage
Use the unified `color()` function to apply colors.

```typescript
// Named Colors (Extended Palette)
color("Success!", "mint");
color("Warning!", "coral");

// Hex Codes
color("Brand Color", "#30BFEB");

// Standard ANSI
color("Error", "red");
```

### Rainbow Gradients
Create lolcat-style gradients for special effects.

```typescript
console.log(rainbow("This is magical text", 0.5));
```

### Available Colors
- **Basics**: red, green, blue, yellow, magenta, cyan, white, black, gray
- **Extended**: coral, peach, salmon, rose, mint, lime, emerald, sky, sapphire, indigo, violet, lavender, gold, amber, teal

## Style System

The `Style` class allows you to compose complex text styling with a fluent API.

```typescript
console.log(
  NewStyle()
    .foreground("white")
    .background("indigo")
    .border("rounded")
    .borderForeground("violet")
    .padding(1, 2)
    .align(0.5) // Center align
    .render("Styled Box Content")
);
```

### Layout Properties
- `.padding(top, [right, bottom, left])`: Add internal spacing
- `.margin(top, [right, bottom, left])`: Add external spacing
- `.width(n)`: Set fixed width (content is aligned within this width)
- `.align(position)`: 0 (Left), 0.5 (Center), 1 (Right)

### Styling Properties
- `.foreground(color)`: Set text color
- `.background(color)`: Set background color
- `.bold()`, `.italic()`, `.underline()`, `.dim()`: Text modifiers

## Tables

Render structured data with automatic column sizing.

```typescript
const headers = ["ID", "Name", "Status"];
const rows = [
    ["01", "Bot A", color("Online", "green")],
    ["02", "Bot B", color("Offline", "red")],
];

renderTable(headers, rows, {
    border: "double",
    borderColor: "blue"
});
```

### Table Options
- `border`: 'normal', 'rounded', 'thick', 'double', 'hidden' (or custom Border object)
- `borderColor`: Color of the table border
