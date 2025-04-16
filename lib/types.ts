export type CurrencyData = {
  currency: string;
  date: string;
  delta: number;
  index: "UP" | "DOWN" | "SAME";
  logo: string | null;
  name: string;
  quant: string;
  sort: string;
  value: string;
};

export type CurrenciesData = {
  [date: string]: {
    [currencyCode: string]: CurrencyData;
  };
};

export type HistoricalData = {
  date: string;
  value: string;
  change: number;
  direction: "UP" | "DOWN" | "SAME";
};
