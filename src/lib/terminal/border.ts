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
