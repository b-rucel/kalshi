export interface Border {
    top: string;
    bottom: string;
    left: string;
    right: string;
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    middleLeft: string;
    middleRight: string;
    middle: string;
    middleTop: string;
    middleBottom: string;
    middleHorizontal?: string;
    middleVertical?: string;
}

export const NormalBorder: Border = {
    top: "─", bottom: "─", left: "│", right: "│",
    topLeft: "┌", topRight: "┐", bottomLeft: "└", bottomRight: "┘",
    middleLeft: "├", middleRight: "┤", middle: "┼", middleTop: "┬", middleBottom: "┴"
};

export const RoundedBorder: Border = {
    top: "─", bottom: "─", left: "│", right: "│",
    topLeft: "╭", topRight: "╮", bottomLeft: "╰", bottomRight: "╯",
    middleLeft: "├", middleRight: "┤", middle: "┼", middleTop: "┬", middleBottom: "┴"
};

export const ThickBorder: Border = {
    top: "━", bottom: "━", left: "┃", right: "┃",
    topLeft: "┏", topRight: "┓", bottomLeft: "┗", bottomRight: "┛",
    middleLeft: "┣", middleRight: "┫", middle: "╋", middleTop: "┳", middleBottom: "┻"
};

export const DoubleBorder: Border = {
    top: "═", bottom: "═", left: "║", right: "║",
    topLeft: "╔", topRight: "╗", bottomLeft: "╚", bottomRight: "╝",
    middleLeft: "╠", middleRight: "╣", middle: "╬", middleTop: "╦", middleBottom: "╩"
};

export const HiddenBorder: Border = {
    top: " ", bottom: " ", left: " ", right: " ",
    topLeft: " ", topRight: " ", bottomLeft: " ", bottomRight: " ",
    middleLeft: " ", middleRight: " ", middle: " ", middleTop: " ", middleBottom: " "
};

export type BorderStyle = 'normal' | 'rounded' | 'thick' | 'double' | 'hidden';

/**
 * Resolves a border definition from a string name (e.g. 'rounded') or returns the border object as-is.
 * This allows APIs to accept both convenient string shorthands and full custom Border objects.
 *
 * @param b - The border style string ('rounded', 'double', etc.) or a full Border object
 * @returns A valid Border object ready for rendering
 */
export function resolveBorder(b?: Border | BorderStyle): Border {
    if (!b) return NormalBorder;
    if (typeof b === 'string') {
        switch (b) {
            case 'rounded': return RoundedBorder;
            case 'thick': return ThickBorder;
            case 'double': return DoubleBorder;
            case 'hidden': return HiddenBorder;
            case 'normal':
            default: return NormalBorder;
        }
    }
    return b;
}
