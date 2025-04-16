"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowDown,
  ArrowUp,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react";
import CurrencyDetail from "./currency-detail";
import { formatDate, sortCurrencies } from "@/lib/utils";
import { mockCurrencyData } from "@/lib/mock-data";
import type { CurrencyData } from "@/lib/types";

export default function CurrencyTable() {
  const [currencies, setCurrencies] = useState<CurrencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string>("sort");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setTimeout(() => {
      setCurrencies(Object.values(mockCurrencyData["2025-03-03"]));
      setLoading(false);
    }, 500);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <ArrowUp className="inline-block ml-1 h-4 w-4" />
      ) : (
        <ArrowDown className="inline-block ml-1 h-4 w-4" />
      );
    } else {
      return <ArrowDown className="inline-block ml-1 h-4 w-4 opacity-30" />;
    }
  };

  const renderDeltaIcon = (index: string) => {
    if (index === "UP") {
      return <ArrowUp className="inline-block ml-1 h-4 w-4" />;
    } else if (index === "DOWN") {
      return <ArrowDown className="inline-block ml-1 h-4 w-4" />;
    } else {
      return <Minus className="inline-block ml-1 h-4 w-4" />;
    }
  };

  const handleCurrencyClick = (currencyCode: string) => {
    setSelectedCurrency(
      selectedCurrency === currencyCode ? null : currencyCode
    );
  };

  if (loading) {
    return <CurrencySkeleton />;
  }

  const sortedCurrencies = sortCurrencies(currencies, sortField, sortDirection);

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex justify-between items-center">
        <p className="text-lg font-medium">
          Курсы валют на {formatDate("2025-03-03")}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          Обновить
        </button>
      </div>

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("currency")}
            >
              Код валюты {renderSortIcon("currency")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("name")}
            >
              Наименование {renderSortIcon("name")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Единиц
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("value")}
            >
              Курс {renderSortIcon("value")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("delta")}
            >
              Изменение {renderSortIcon("delta")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedCurrencies.map((currency) => (
            <React.Fragment key={currency.currency}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleCurrencyClick(currency.currency)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                  {currency.currency}
                  {selectedCurrency === currency.currency ? (
                    <ChevronUp className="ml-1 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currency.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currency.quant}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {currency.value}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm ${
                    currency.index === "UP"
                      ? "text-green-600"
                      : currency.index === "DOWN"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {currency.delta > 0 ? "+" : ""}
                  {currency.delta}
                  {renderDeltaIcon(currency.index)}
                </td>
              </tr>

              {selectedCurrency === currency.currency && (
                <tr>
                  <td colSpan={5} className="px-0 py-0 border-t-0">
                    <CurrencyDetail currency={currency} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CurrencySkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3">
          <div className="grid grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
