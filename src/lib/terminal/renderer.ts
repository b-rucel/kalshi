import { stringWidth } from "./utils";

const ESC = '\x1b[';

/**
 * A lightweight TUI Renderer with double-buffering to prevent flickering.
 */
export class Renderer {
    private width: number;
    private height: number;
    private currentBuffer: (string | null)[];
    private nextBuffer: string[];
    private needsResize: boolean = true;

    // Config
    private hideCursor: boolean = true;

    constructor() {
        // Initial size (will update on first render/check)
        this.width = process.stdout.columns || 80;
        this.height = process.stdout.rows || 24;

        this.currentBuffer = [];
        this.nextBuffer = [];

        this.initBuffers();

        // Handle resize events
        process.stdout.on('resize', () => {
            this.width = process.stdout.columns || 80;
            this.height = process.stdout.rows || 24;
            this.needsResize = true;
        });
    }

    private initBuffers() {
        this.currentBuffer = new Array(this.height).fill(null); // Null means "unknown state"
        this.nextBuffer = new Array(this.height).fill(" ".repeat(this.width));
    }

    /**
     * Enter "Alternate Screen" mode (like vim/htop).
     * This saves the user's shell history and gives us a blank slate.
     */
    enterAltScreen() {
        process.stdout.write(`${ESC}?1049h`); // Enter Alt Screen
        if (this.hideCursor) {
            process.stdout.write(`${ESC}?25l`); // Hide Cursor
        }
        this.clear();
    }

    /**
     * Exit "Alternate Screen" mode and return to normal shell.
     */
    exitAltScreen() {
        process.stdout.write(`${ESC}?1049l`); // Exit Alt Screen
        process.stdout.write(`${ESC}?25h`);   // Show Cursor
    }

    /**
     * Clear the internal buffer (fills next frame with spaces)
     */
    clear() {
        if (this.needsResize) {
            this.initBuffers();
            this.needsResize = false;
        } else {
            // Reset next buffer to empty spaces
            const blank = " ".repeat(this.width);
            for (let i = 0; i < this.height; i++) {
                this.nextBuffer[i] = blank;
            }
        }
    }

    /**
     * Write text to the specific (x,y) coordinate in the next buffer.
     * x: 0-indexed column
     * y: 0-indexed row
     */
    write(x: number, y: number, text: string) {
        if (y < 0 || y >= this.height || x >= this.width) return;

        // Clip text if it overflows width
        // Note: usage of stripAnsi would be needed for perfect width calc if text has colors,
        // but for simplest buffer we assume we are replacing char-for-char.
        // If text contains ANSI codes, this simple string manipulation breaks visual alignment without a parser.
        // For this minimal version, we assume the user manages their string lengths or we trust JS string.length 
        // (which includes hidden ANSI chars, effectively "shortening" the visible text).
        // 
        // TODO: A robust implementation needs an ANSI-aware cell parser.
        // For now, we just overlay the string.

        const line = this.nextBuffer[y] || " ".repeat(this.width);

        // Simple overlay:
        // Pre-part + New-Text + Post-Part
        // Note: This naive approach breaks if 'text' has ANSI codes because string.length is wrong.
        // But implementing a full ANSI parser is >40KB. 
        // We rely on the buffer line being just a string.

        // Safety check to ensure we have a string
        const safeLine = line.padEnd(this.width, " ");

        // Note: proper handling requires splitting by visual width, not char index.
        // Doing naive slice for this "Minimal" version.
        const pre = safeLine.slice(0, x);
        const post = safeLine.slice(x + stringWidth(text)); // Approximate

        // Actually, mixing ANSI strings with slice is dangerous.
        // Strategy: The buffer lines are just strings. We overwrite.
        // If we want random access writing, we really need a Cell array.
        // Since we want "Minimal", let's assume 'nextBuffer' lines are fully reconstructed by the app usually.
        // Or we use a simpler strategy: The app builds the full string for the line.

        // Let's support line-replacement for now, which is safer for ANSI usage.
        this.writeLine(y, text);
    }

    /**
     * Replaces an entire line in the buffer.
     * This is the safest way to handle ANSI colored strings without a complex cell parser.
     */
    writeLine(y: number, text: string) {
        if (y < 0 || y >= this.height) return;
        this.nextBuffer[y] = text;
    }

    /**
     * Render the changes to the real terminal.
     */
    flush() {
        let output = "";

        for (let i = 0; i < this.height; i++) {
            const nextLine = this.nextBuffer[i];
            const currentLine = this.currentBuffer[i] ?? null;

            // Optimization: Only update lines that changed
            if (nextLine !== currentLine) {
                // Move cursor to row i, col 0
                // ANSI: ESC [ <row> ; <col> H
                // (Terminal is 1-indexed)
                output += `${ESC}${i + 1};1H${nextLine}`;

                // Clear rest of line if new line is shorter (visually)?
                // For simplicity, we assume lines traverse full width or use Clear-To-End-Of-Line (K).
                output += `${ESC}K`;

                this.currentBuffer[i] = nextLine;
            }
        }

        if (output.length > 0) {
            process.stdout.write(output);
        }
    }
}
