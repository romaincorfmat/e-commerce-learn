import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class name values into a single string, resolving Tailwind CSS class conflicts.
 *
 * Accepts any combination of strings, arrays, or objects as class values and returns a merged class string suitable for use in JSX.
 *
 * @returns The merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats an ISO date string into a human-readable date in "MMM d, yyyy" format (e.g., "Jan 1, 2023").
 *
 * Returns an empty string if the input is falsy or not a valid date.
 *
 * @param dateString - An ISO date string to format.
 * @returns The formatted date string, or an empty string if the input is invalid.
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Formats a numeric price as a currency string using the specified currency code.
 *
 * Returns an empty string if {@link price} is `undefined` or `null`.
 *
 * @param price - The numeric value to format as currency.
 * @param currency - The ISO 4217 currency code to use (defaults to "USD").
 * @returns The formatted currency string, or an empty string if {@link price} is not provided.
 */
export function formatPrice(price: number, currency = "USD"): string {
  if (price === undefined || price === null) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
