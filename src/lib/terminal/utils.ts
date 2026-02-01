// String Utilities

export function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function stringWidth(str: string): number {
  return stripAnsi(str).length;
}

export function padRight(str: string, width: number): string {
  const len = stringWidth(str);
  if (len >= width) return str;
  return str + " ".repeat(width - len);
}

export function padLeft(str: string, width: number): string {
  const len = stringWidth(str);
  if (len >= width) return str;
  return " ".repeat(width - len) + str;
}

export function center(str: string, width: number): string {
  const len = stringWidth(str);
  if (len >= width) return str;
  const left = Math.floor((width - len) / 2);
  const right = width - len - left;
  return " ".repeat(left) + str + " ".repeat(right);
}
