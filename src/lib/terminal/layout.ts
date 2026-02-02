import { stringWidth } from './utils';
import { Left, Right, Center, type Position } from './style';

export type Alignment = Position;
export { Left, Right, Center };

export const Top: Alignment = 0;
export const Bottom: Alignment = 1;

/**
 * Joins multiple text blocks horizontally.
 * @param align Vertical alignment for blocks of different heights (Top, Center, Bottom)
 * @param gap Number of spaces between blocks
 * @param blocks The text blocks to join
 */
export function joinHorizontal(align: Alignment, gap: number = 0, ...blocks: string[]): string {
    if (blocks.length === 0) return "";

    // Split all blocks into lines
    const blocksLines = blocks.map(b => b.split('\n'));

    // Find max height
    const maxHeight = Math.max(...blocksLines.map(lines => lines.length));

    const resultLines: string[] = [];
    const gapStr = " ".repeat(gap);

    for (let i = 0; i < maxHeight; i++) {
        const lineParts: string[] = [];

        for (let bIndex = 0; bIndex < blocksLines.length; bIndex++) {
            const lines = blocksLines[bIndex];
            if (!lines) continue;

            const height = lines.length;
            // Calculate width of this block (max line width)
            const width = Math.max(0, ...lines.map(stringWidth));

            // Calculate vertical offset based on alignment
            let startY = 0;
            if (align === Center) startY = Math.floor((maxHeight - height) / 2);
            else if (align === Bottom) startY = maxHeight - height;

            // Check if current line 'i' is within the block relative to its alignment
            const relativeIndex = i - startY;

            let part = "";
            if (relativeIndex >= 0 && relativeIndex < height) {
                // Line exists
                const line = lines[relativeIndex];
                if (line !== undefined) {
                    part = line;
                    // Pad to full width of this block
                    const w = stringWidth(part);
                    part += " ".repeat(Math.max(0, width - w));
                } else {
                    part = " ".repeat(width);
                }
            } else {
                // Empty space
                part = " ".repeat(width);
            }

            lineParts.push(part);
        }

        resultLines.push(lineParts.join(gapStr));
    }

    return resultLines.join('\n');
}

/**
 * Joins multiple text blocks vertically.
 * @param align Horizontal alignment for blocks of different widths (Left, Center, Right)
 * @param gap Number of empty lines between blocks
 * @param blocks The text blocks to join
 */
export function joinVertical(align: Alignment, gap: number = 0, ...blocks: string[]): string {
    if (blocks.length === 0) return "";

    const maxWidth = Math.max(...blocks.map(b =>
        Math.max(...b.split('\n').map(stringWidth))
    ));

    const finalBlocks: string[] = [];

    for (const block of blocks) {
        const lines = block.split('\n');
        const alignedLines = lines.map(line => {
            const w = stringWidth(line);
            if (w >= maxWidth) return line;

            const remaining = maxWidth - w;
            if (align === Left) return line + " ".repeat(remaining);
            if (align === Right) return " ".repeat(remaining) + line;
            // Center
            const left = Math.floor(remaining / 2);
            return " ".repeat(left) + line + " ".repeat(remaining - left);
        });

        finalBlocks.push(alignedLines.join('\n'));
    }

    const gapLines = gap > 0 ? '\n'.repeat(gap) : '';
    // If we have a gap, we might want to ensure the empty lines have width if we were pasting this into something else,
    // but usually empty lines are just newlines. 
    // However, joinVertical typically just stacks them.

    return finalBlocks.join('\n' + gapLines);
}

/**
 * Places content within a fixed size container.
 * @param width Container width
 * @param height Container height
 * @param hAlign Horizontal alignment (0-1)
 * @param vAlign Vertical alignment (0-1)
 * @param content The content string
 */
export function place(width: number, height: number, hAlign: Alignment, vAlign: Alignment, content: string): string {
    const lines = content.split('\n');
    const contentHeight = lines.length;
    // const contentWidth = Math.max(...lines.map(stringWidth));

    const resultLines: string[] = [];

    // Calculate Vertical Start
    let startY = 0;
    if (vAlign === Center) startY = Math.floor((height - contentHeight) / 2);
    else if (vAlign === Bottom) startY = height - contentHeight;
    startY = Math.max(0, startY);

    for (let y = 0; y < height; y++) {
        const relativeY = y - startY;

        if (relativeY >= 0 && relativeY < contentHeight) {
            const line = lines[relativeY];
            if (line !== undefined) {
                const lineWidth = stringWidth(line);

                // Calculate Horizontal Start
                let startX = 0;
                if (hAlign === Center) startX = Math.floor((width - lineWidth) / 2);
                else if (hAlign === Right) startX = width - lineWidth;
                startX = Math.max(0, startX);

                const rightPad = width - startX - lineWidth;

                resultLines.push(" ".repeat(startX) + line + " ".repeat(Math.max(0, rightPad)));
            } else {
                resultLines.push(" ".repeat(width));
            }
        } else {
            resultLines.push(" ".repeat(width));
        }
    }

    return resultLines.join('\n');
}
