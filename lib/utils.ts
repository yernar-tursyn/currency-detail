import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CurrencyData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function sortCurrencies(
  currencies: CurrencyData[],
  sortField: string,
  sortDirection: "asc" | "desc"
): CurrencyData[] {
  return [...currencies].sort((a, b) => {
    let aValue: string | number = "";
    let bValue: string | number = "";

    if (sortField in a && sortField in b) {
      if (sortField === "value" || sortField === "delta") {
        const aStr = String(a[sortField as keyof CurrencyData] ?? "0");
        const bStr = String(b[sortField as keyof CurrencyData] ?? "0");
        aValue = Number.parseFloat(aStr) || 0;
        bValue = Number.parseFloat(bStr) || 0;
      } else if (sortField === "sort") {
        aValue = Number.parseInt(a.sort || "0", 10) || 0;
        bValue = Number.parseInt(b.sort || "0", 10) || 0;
      } else {
        aValue = String(a[sortField as keyof CurrencyData] ?? "");
        bValue = String(b[sortField as keyof CurrencyData] ?? "");
      }
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });
}
