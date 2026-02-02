const ESC = "\x1b[";

// ANSI Codes - merged with extended palette
export const CODES = {
    reset: 0,
    bold: 1,
    dim: 2,
    italic: 3,
    underline: 4,
    reverse: 7,
    hidden: 8,

    // Standard ANSI Colors
    black: 30,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    magenta: 35,
    cyan: 36,
    white: 37,
    gray: 90,

    // Backgrounds
    bgBlack: 40,
    bgRed: 41,
    bgGreen: 42,
    bgYellow: 43,
    bgBlue: 44,
    bgMagenta: 45,
    bgCyan: 46,
    bgWhite: 47,

    // Extended Palette (mapped to strings for special handling in color functions)
    // These are not simple integers like the standard ANSI codes
    coral: '\x1b[38;2;255;127;80m',
    peach: '\x1b[38;2;255;218;185m',
    lavender: '\x1b[38;2;230;230;250m',
    mint: '\x1b[38;2;152;255;152m',
    sky: '\x1b[38;2;135;206;235m',
    rose: '\x1b[38;2;255;182;193m',
    gold: '\x1b[38;2;255;215;0m',
    violet: '\x1b[38;2;238;130;238m',
    aqua: '\x1b[38;2;127;255;212m',
    salmon: '\x1b[38;2;250;128;114m',
    lime: '\x1b[38;2;50;205;50m',
    indigo: '\x1b[38;2;75;0;130m',
    teal: '\x1b[38;2;0;128;128m',
    amber: '\x1b[38;2;255;191;0m',
    crimson: '\x1b[38;2;220;20;60m',
    emerald: '\x1b[38;2;80;200;120m',
    sapphire: '\x1b[38;2;15;82;186m',

    // Muted
    mutedRed: '\x1b[38;2;180;100;100m',
    mutedGreen: '\x1b[38;2;120;160;120m',
    mutedBlue: '\x1b[38;2;100;120;180m',
    mutedYellow: '\x1b[38;2;200;180;100m',
    mutedPurple: '\x1b[38;2;160;120;160m',
    mutedOrange: '\x1b[38;2;200;140;100m',

    // Extended Grays
    lightGray: '\x1b[38;2;192;192;192m',
    darkGray: '\x1b[38;2;64;64;64m',
};

// Helper for Hex conversion
function hexToRgb(hex: string): [number, number, number] | null {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) return null;

    const int = parseInt(hex, 16);
    return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export function rgb(r: number, g: number, b: number): string {
    return `\x1b[38;2;${r};${g};${b}m`;
}

export function hsl(h: number, s: number, l: number): string {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return rgb(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

// Unified Color Function
export const color = (str: string, code: number | string) => {
    if (typeof code === 'number') {
        // Standard ANSI code
        return `${ESC}${code}m${str}${ESC}0m`;
    } else if (typeof code === 'string') {
        if (code.startsWith('#')) {
            // Hex Color
            const rgbVal = hexToRgb(code);
            if (rgbVal) {
                return `${ESC}38;2;${rgbVal[0]};${rgbVal[1]};${rgbVal[2]}m${str}${ESC}0m`;
            }
        } else if (code in CODES) {
            // Named Color (Standard or Extended)
            // @ts-ignore
            const val = CODES[code];
            if (typeof val === 'string') {
                // Extended color (raw ANSI string)
                return `${val}${str}${ESC}0m`;
            } else {
                // Standard ANSI (number)
                return `${ESC}${val}m${str}${ESC}0m`;
            }
        } else if (code.startsWith('\x1b[')) {
            // Raw ANSI code passed directly
            return `${code}${str}${ESC}0m`;
        }
    }
    return str;
};

// Rainbow Function
export function rainbow(text: string, frequency: number = 0.3): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const r = Math.floor(Math.sin(frequency * i + 0) * 55 + 145);
        const g = Math.floor(Math.sin(frequency * i + 2) * 55 + 145);
        const b = Math.floor(Math.sin(frequency * i + 4) * 55 + 145);
        result += `\x1b[38;2;${r};${g};${b}m${text[i]}`;
    }
    return result + `${ESC}0m`;
}

// Helper to get ANSI prefix for a color (used by Style)
export const colorToAnsiPrefix = (code: number | string, isBg: boolean = false): string => {
    if (typeof code === 'number') {
        return `${ESC}${code}m`;
    } else if (typeof code === 'string') {
        if (code.startsWith('#')) {
            const rgbVal = hexToRgb(code);
            if (rgbVal) {
                return `${ESC}${isBg ? '48' : '38'};2;${rgbVal[0]};${rgbVal[1]};${rgbVal[2]}m`;
            }
        } else if (code in CODES) {
            // @ts-ignore
            const val = CODES[code];
            if (typeof val === 'string') {
                // Extended color - mostly foregrounds
                // Backgrounds for extended colors would need \x1b[48;2... equivalent which we haven't pre-calculated
                // For now, return as-is for foreground, ignore for background if not supported
                return isBg ? "" : val;
            }
            if (isBg && val < 40) return `${ESC}${val + 10}m`; // Convert fg to bg if needed
            return `${ESC}${val}m`;
        }
    }
    return "";
}

// --- Shorthand Helpers ---

const style = (code: number) => (str: string | number) => `${ESC}${code}m${str}${ESC}0m`;

export const bold = style(CODES.bold);
export const dim = style(CODES.dim);
export const italic = style(CODES.italic);
export const underline = style(CODES.underline);
export const inverse = style(CODES.reverse);

export const black = style(CODES.black);
export const red = style(CODES.red);
export const green = style(CODES.green);
export const yellow = style(CODES.yellow);
export const blue = style(CODES.blue);
export const magenta = style(CODES.magenta);
export const cyan = style(CODES.cyan);
export const white = style(CODES.white);
export const gray = style(CODES.gray);

export const bgBlack = style(CODES.bgBlack);
export const bgRed = style(CODES.bgRed);
export const bgGreen = style(CODES.bgGreen);
export const bgYellow = style(CODES.bgYellow);
export const bgBlue = style(CODES.bgBlue);
export const bgMagenta = style(CODES.bgMagenta);
export const bgCyan = style(CODES.bgCyan);
export const bgWhite = style(CODES.bgWhite);
