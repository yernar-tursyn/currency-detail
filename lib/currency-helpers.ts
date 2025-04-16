import type { CurrencyData, HistoricalData } from "./types";

export function generateHistoricalData(
  currency: CurrencyData
): HistoricalData[] {
  const baseValue = Number.parseFloat(currency.value);
  const result: HistoricalData[] = [];

  result.push({
    date: currency.date,
    value: baseValue.toFixed(2),
    change: currency.delta,
    direction: currency.index,
  });

  const changes = [3.27, 0, 0, -0.24, -5.3];
  const directions: ("UP" | "DOWN" | "SAME")[] = [
    "UP",
    "SAME",
    "SAME",
    "DOWN",
    "DOWN",
  ];

  for (let i = 0; i < 5; i++) {
    const date = new Date(currency.date);
    date.setDate(date.getDate() - (i + 1));
    const dateStr = date.toISOString().split("T")[0];

    result.push({
      date: dateStr,
      value: (baseValue + (i === 0 ? changes[i] : 0)).toFixed(2),
      change: changes[i],
      direction: directions[i],
    });
  }

  return result;
}
