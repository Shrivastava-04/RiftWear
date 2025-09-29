// client/src/lib/utils.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Removed the 'type ClassValue' declaration as it's TypeScript-specific.
// Removed type annotations for 'inputs' parameter and the return type.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
