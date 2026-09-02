/**
 * @file Styling utilities for console.group in browser and Node.js environments.
 * Provides CSS styles for the browser and ANSI escape codes for Node.js.
 */

/**
 * Generates a CSS style string for browser console.group.
 * @param background - Background color (hex, rgb, etc.).
 * @param color - Text color.
 * @returns A CSS style string.
 */
export const _styleBrowser = (background?: string, color?: string): string => {
  const styles: string[] = [
    "border-radius: 5px; padding: 2.5px; font-style: italic;",
  ];
  if (background) styles.push(`background-color: ${background};`);
  if (color) styles.push(`color: ${color};`);
  return styles.join(" ");
};

/**
 * Generates an ANSI escape sequence for Node.js console.group.
 * @param text - The text to display.
 * @param color - Text color (hex).
 * @param backgroundColor - Background color (hex).
 * @returns A string with ANSI escape codes for colored output.
 */
export const _styleNode = (
  text: string,
  color?: string,
  backgroundColor?: string
): string => {
  const ANSI_RESET = "\x1b[0m";
  const foreground = color ? _hexToAnsiForeground(color) : "";
  const background = backgroundColor ? _hexToAnsiBackground(backgroundColor) : "";
  return `${foreground}${background}${text}${ANSI_RESET}`;
};

/**
 * Converts a hex color to RGB components.
 * @param hex - Hex color string (e.g., "#ff0000" or "ff0000").
 * @returns An object with r, g, b properties, or null if invalid.
 */
const _hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
};

/**
 * Converts a hex color to ANSI foreground escape code.
 * @param hex - Hex color string.
 * @returns ANSI escape code for foreground color, or empty string if invalid.
 */
const _hexToAnsiForeground = (hex: string): string => {
  const rgb = _hexToRgb(hex);
  if (!rgb) return "";
  return `\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`;
};

/**
 * Converts a hex color to ANSI background escape code.
 * @param hex - Hex color string.
 * @returns ANSI escape code for background color, or empty string if invalid.
 */
const _hexToAnsiBackground = (hex: string): string => {
  const rgb = _hexToRgb(hex);
  if (!rgb) return "";
  return `\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`;
};