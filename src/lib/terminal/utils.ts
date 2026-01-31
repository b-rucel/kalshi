const ESC = "\x1b[";

function hexToRgb(hex: string): [number, number, number] | null {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) return null;
  
  const int = parseInt(hex, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

export const color = (str: string, code: number | string) => {
  if (typeof code === 'number') {
    return `${ESC}${code}m${str}${ESC}0m`;
  } else if (typeof code === 'string' && code.startsWith('#')) {
    const rgb = hexToRgb(code);
    if (rgb) {
      return `${ESC}38;2;${rgb[0]};${rgb[1]};${rgb[2]}m${str}${ESC}0m`;
    }
  }
  return str;
};

export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function stringWidth(str: string): number {
  return stripAnsi(str).length;
}
