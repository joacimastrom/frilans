/**
 * Utility functions for number formatting and parsing
 */

/**
 * Format a number using Swedish locale formatting
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("sv-SE").format(value);
};

/**
 * Parse a formatted string back to a number with 2 decimal precision
 */
export const parseNumber = (value: string): number => {
  const num = parseFloat(value.replace(/\s/g, "")) || 0;
  return formatToTwoDecimals(num);
};

/**
 * Helper function to format numbers to 2 decimals
 */
export const formatToTwoDecimals = (value: string | number): number => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};
