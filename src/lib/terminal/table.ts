import type { Border, BorderStyle } from "./border";
import { NormalBorder, RoundedBorder, ThickBorder, DoubleBorder, HiddenBorder, resolveBorder } from "./border";
import { color } from "./colors";
import { stringWidth } from "./utils";

export type { BorderStyle };

export interface TableOptions {
  borderColor?: number | string;
  border?: Border | BorderStyle;
}

export function renderTable(headers: string[], rows: string[][], options: TableOptions = {}) {
  // clearScreen();

  if (headers.length === 0 && rows.length === 0) return;

  const numCols = Math.max(
    headers.length,
    rows.length > 0 ? Math.max(...rows.map(r => r.length)) : 0
  );

  const colWidths = new Array(numCols).fill(0);

  // Calculate widths
  for (let i = 0; i < numCols; i++) {
    let max = 0;
    if (headers[i]) {
      max = Math.max(max, stringWidth(headers[i] || ""));
    }
    for (const row of rows) {
      if (row[i]) {
        max = Math.max(max, stringWidth(row[i] || ""));
      }
    }
    colWidths[i] = max + 2; // +2 for padding
  }


  // Box Drawing Characters
  const border = resolveBorder(options.border);

  // Border Color Helper
  const b = (str: string) => options.borderColor ? color(str, options.borderColor) : str;

  const buildBorder = (left: string, mid: string, right: string, join: string) => {
    let s = b(left);
    for (let i = 0; i < numCols; i++) {
      s += b(mid.repeat(colWidths[i]));
      if (i < numCols - 1) s += b(join);
    }
    s += b(right);
    return s;
  };

  const topBorder = buildBorder(border.topLeft, border.top, border.topRight, border.middleTop);
  const midBorder = buildBorder(border.middleLeft, border.middleHorizontal || border.top, border.middleRight, border.middle);
  const botBorder = buildBorder(border.bottomLeft, border.bottom, border.bottomRight, border.middleBottom);
  const vBorder = b(border.left);
  const vBorderRight = b(border.right);
  const vBorderMid = b(border.middleVertical || border.left);

  // Table Top
  console.log(topBorder);

  // Header
  if (headers.length > 0) {
    let s = vBorder;
    for (let i = 0; i < numCols; i++) {
      const content = headers[i] || "";
      const pad = colWidths[i] - stringWidth(content);
      // Center align header
      const padLeft = Math.floor(pad / 2);
      const padRight = pad - padLeft;
      s += " ".repeat(padLeft) + content + " ".repeat(padRight);

      if (i < numCols - 1) {
        s += vBorderMid;
      } else {
        s += vBorderRight;
      }
    }
    console.log(s);
    console.log(midBorder);
  }

  // Rows
  for (const row of rows) {
    let s = vBorder;
    for (let i = 0; i < numCols; i++) {
      const content = row[i] || "";
      const w = colWidths[i];
      const visibleLen = stringWidth(content);
      // Left align body with 1 char padding
      const totalPad = w - visibleLen;
      const l = 1;
      const r = totalPad - l;
      s += " ".repeat(l) + content + " ".repeat(r);

      if (i < numCols - 1) {
        s += vBorderMid;
      } else {
        s += vBorderRight;
      }
    }
    console.log(s);
  }

  // Table Bottom
  console.log(botBorder);
}
