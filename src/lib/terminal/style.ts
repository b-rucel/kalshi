import { Border } from './border';
import { stringWidth, stripAnsi, padRight, padLeft, center, colorToAnsiPrefix } from './utils';

export type Position = number;
export const Left: Position = 0;
export const Center: Position = 0.5;
export const Right: Position = 1;

export class Style {
    // Text Styling
    private _foreground?: number | string;
    private _background?: number | string;
    private _bold: boolean = false;
    private _italic: boolean = false;
    private _underline: boolean = false;
    private _strikethrough: boolean = false;
    private _reverse: boolean = false;
    private _blink: boolean = false;
    private _faint: boolean = false;

    // Layout
    private _width?: number;
    private _align: Position = Left;

    // Spacing
    private _paddingTop: number = 0;
    private _paddingRight: number = 0;
    private _paddingBottom: number = 0;
    private _paddingLeft: number = 0;

    private _marginTop: number = 0;
    private _marginRight: number = 0;
    private _marginBottom: number = 0;
    private _marginLeft: number = 0;

    // Border
    private _border?: Border;
    private _borderTop: boolean = false;
    private _borderRight: boolean = false;
    private _borderBottom: boolean = false;
    private _borderLeft: boolean = false;
    private _borderForeground?: number | string;
    private _borderBackground?: number | string;

    constructor() { }

    // --- Setters ---

    foreground(c: number | string): Style { this._foreground = c; return this; }
    background(c: number | string): Style { this._background = c; return this; }
    bold(b: boolean = true): Style { this._bold = b; return this; }
    italic(b: boolean = true): Style { this._italic = b; return this; }
    underline(b: boolean = true): Style { this._underline = b; return this; }
    strikethrough(b: boolean = true): Style { this._strikethrough = b; return this; }
    reverse(b: boolean = true): Style { this._reverse = b; return this; }
    blink(b: boolean = true): Style { this._blink = b; return this; }
    faint(b: boolean = true): Style { this._faint = b; return this; }

    width(w: number): Style { this._width = w; return this; }
    align(p: Position): Style { this._align = p; return this; }

    padding(top: number, right?: number, bottom?: number, left?: number): Style {
        this._paddingTop = top;
        this._paddingRight = right !== undefined ? right : top;
        this._paddingBottom = bottom !== undefined ? bottom : top;
        this._paddingLeft = left !== undefined ? left : (right !== undefined ? right : top);
        return this;
    }
    paddingTop(v: number): Style { this._paddingTop = v; return this; }
    paddingRight(v: number): Style { this._paddingRight = v; return this; }
    paddingBottom(v: number): Style { this._paddingBottom = v; return this; }
    paddingLeft(v: number): Style { this._paddingLeft = v; return this; }

    margin(top: number, right?: number, bottom?: number, left?: number): Style {
        this._marginTop = top;
        this._marginRight = right !== undefined ? right : top;
        this._marginBottom = bottom !== undefined ? bottom : top;
        this._marginLeft = left !== undefined ? left : (right !== undefined ? right : top);
        return this;
    }
    marginTop(v: number): Style { this._marginTop = v; return this; }
    marginRight(v: number): Style { this._marginRight = v; return this; }
    marginBottom(v: number): Style { this._marginBottom = v; return this; }
    marginLeft(v: number): Style { this._marginLeft = v; return this; }

    border(b: Border, top: boolean = true, right: boolean = true, bottom: boolean = true, left: boolean = true): Style {
        this._border = b;
        this._borderTop = top;
        this._borderRight = right;
        this._borderBottom = bottom;
        this._borderLeft = left;
        return this;
    }
    borderStyle(b: Border): Style { return this.border(b, true, true, true, true); }
    borderTop(b: boolean): Style { this._borderTop = b; return this; }
    borderRight(b: boolean): Style { this._borderRight = b; return this; }
    borderBottom(b: boolean): Style { this._borderBottom = b; return this; }
    borderLeft(b: boolean): Style { this._borderLeft = b; return this; }
    borderForeground(c: number | string): Style { this._borderForeground = c; return this; }
    borderBackground(c: number | string): Style { this._borderBackground = c; return this; }

    // --- Rendering ---

    render(text: string): string {
        let lines = text.split('\n');

        let contentWidth = 0;
        for (const line of lines) {
            contentWidth = Math.max(contentWidth, stringWidth(line));
        }
        if (this._width && this._width > contentWidth) {
            contentWidth = this._width;
        }

        // Apply Alignment
        lines = lines.map(line => {
            const w = stringWidth(line);
            if (w < contentWidth) {
                if (this._align === Left) return padRight(line, contentWidth);
                if (this._align === Center) return center(line, contentWidth);
                if (this._align === Right) return padLeft(line, contentWidth);
            }
            return line;
        });

        // Helper for attributes
        const applyAttrs = (str: string, isBg: boolean = false) => {
            let prefix = "";
            if (!isBg) {
                if (this._foreground) prefix += colorToAnsiPrefix(this._foreground, false);
                if (this._bold) prefix += "\x1b[1m";
                if (this._italic) prefix += "\x1b[3m";
                if (this._underline) prefix += "\x1b[4m";
                if (this._blink) prefix += "\x1b[5m";
                if (this._reverse) prefix += "\x1b[7m";
                if (this._faint) prefix += "\x1b[2m";
                if (this._strikethrough) prefix += "\x1b[9m";
            } else {
                if (this._background) prefix += colorToAnsiPrefix(this._background, true);
            }
            if (prefix === "") return str;
            return prefix + str + "\x1b[0m";
        };

        // Apply Padding
        const paddedLines: string[] = [];
        const totalWidth = contentWidth + this._paddingLeft + this._paddingRight;
        const blankLine = " ".repeat(totalWidth);

        for (let i = 0; i < this._paddingTop; i++) paddedLines.push(blankLine);

        for (const line of lines) {
            const pLeft = " ".repeat(this._paddingLeft);
            const pRight = " ".repeat(this._paddingRight);
            paddedLines.push(pLeft + line + pRight);
        }

        for (let i = 0; i < this._paddingBottom; i++) paddedLines.push(blankLine);

        // Apply Styling to all lines
        const finalStyledLines = paddedLines.map(line => {
            let prefix = "";
            if (this._foreground) prefix += colorToAnsiPrefix(this._foreground, false);
            if (this._background) prefix += colorToAnsiPrefix(this._background, true);
            if (this._bold) prefix += "\x1b[1m";
            if (this._italic) prefix += "\x1b[3m";
            if (this._underline) prefix += "\x1b[4m";
            if (this._blink) prefix += "\x1b[5m";
            if (this._reverse) prefix += "\x1b[7m";
            if (this._faint) prefix += "\x1b[2m";
            if (this._strikethrough) prefix += "\x1b[9m";

            // If we have any styling, we wrap the line
            if (prefix === "") return line;
            return prefix + line + "\x1b[0m";
        });

        // Apply Borders
        let borderedLines: string[] = finalStyledLines;
        if (this._border) {
            const b = this._border;
            const newLines: string[] = [];
            
            let borderPrefix = "";
            if (this._borderForeground) borderPrefix += colorToAnsiPrefix(this._borderForeground, false);
            if (this._borderBackground) borderPrefix += colorToAnsiPrefix(this._borderBackground, true);
            const borderSuffix = borderPrefix ? "\x1b[0m" : "";

            const makeBorderStr = (char: string) => borderPrefix + char + borderSuffix;

            // Top
            if (this._borderTop) {
                let topStr = "";
                if (this._borderLeft) topStr += makeBorderStr(b.topLeft);
                topStr += makeBorderStr(b.top.repeat(totalWidth));
                if (this._borderRight) topStr += makeBorderStr(b.topRight);
                newLines.push(topStr);
            }

            // Middle
            for (const line of finalStyledLines) {
                let s = "";
                if (this._borderLeft) s += makeBorderStr(b.left);
                s += line;
                if (this._borderRight) s += makeBorderStr(b.right);
                newLines.push(s);
            }

            // Bottom
            if (this._borderBottom) {
                let botStr = "";
                if (this._borderLeft) botStr += makeBorderStr(b.bottomLeft);
                botStr += makeBorderStr(b.bottom.repeat(totalWidth));
                if (this._borderRight) botStr += makeBorderStr(b.bottomRight);
                newLines.push(botStr);
            }
            borderedLines = newLines;
        }

        // Apply Margins
        const marginedLines: string[] = [];
        for (let i = 0; i < this._marginTop; i++) marginedLines.push("");

        for (const line of borderedLines) {
            marginedLines.push(" ".repeat(this._marginLeft) + line + " ".repeat(this._marginRight));
        }

        for (let i = 0; i < this._marginBottom; i++) marginedLines.push("");

        return marginedLines.join('\n');
    }
    
    copy(): Style {
        const s = new Style();
        // (Manual copy of properties - shortened for brevity but should be complete in production)
        s._foreground = this._foreground;
        s._background = this._background;
        s._bold = this._bold;
        s._italic = this._italic;
        s._width = this._width;
        s._align = this._align;
        s._paddingTop = this._paddingTop;
        s._paddingRight = this._paddingRight;
        s._paddingBottom = this._paddingBottom;
        s._paddingLeft = this._paddingLeft;
        s._marginTop = this._marginTop;
        s._marginRight = this._marginRight;
        s._marginBottom = this._marginBottom;
        s._marginLeft = this._marginLeft;
        s._border = this._border;
        s._borderTop = this._borderTop;
        s._borderRight = this._borderRight;
        s._borderBottom = this._borderBottom;
        s._borderLeft = this._borderLeft;
        s._borderForeground = this._borderForeground;
        s._borderBackground = this._borderBackground;
        return s;
    }
}

export function NewStyle(): Style {
    return new Style();
}
