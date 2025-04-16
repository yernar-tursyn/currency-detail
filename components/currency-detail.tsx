"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { generateHistoricalData } from "@/lib/currency-helpers";
import type { CurrencyData } from "@/lib/types";

interface CurrencyDetailProps {
  currency: CurrencyData;
}

const renderDeltaIcon = (direction: string) => {
  if (direction === "UP") {
    return <ArrowUp className="inline-block ml-1 h-4 w-4" />;
  } else if (direction === "DOWN") {
    return <ArrowDown className="inline-block ml-1 h-4 w-4" />;
  } else {
    return <Minus className="inline-block ml-1 h-4 w-4" />;
  }
};

export default function CurrencyDetail({ currency }: CurrencyDetailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const historicalData = generateHistoricalData(currency);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const values = historicalData
      .map((item) => Number.parseFloat(item.value))
      .reverse();

    const minValue = Math.min(...values) - 1;
    const maxValue = Math.max(...values) + 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(
      0,
      canvas.height -
        ((values[0] - minValue) / (maxValue - minValue)) * canvas.height
    );

    for (let i = 1; i < values.length; i++) {
      const x = (i / (values.length - 1)) * canvas.width;
      const y =
        canvas.height -
        ((values[i] - minValue) / (maxValue - minValue)) * canvas.height;
      ctx.lineTo(x, y);
    }

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = "rgba(59, 130, 246, 0.2)";
    ctx.fill();

    for (let i = 0; i < values.length; i++) {
      const x = (i / (values.length - 1)) * canvas.width;
      const y =
        canvas.height -
        ((values[i] - minValue) / (maxValue - minValue)) * canvas.height;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
    }
  }, [historicalData]);

  const monthlyChange = 11.76;

  return (
    <div className="bg-gray-50 p-4 border-t border-gray-200">
      <div className="flex items-center mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 mr-3 flex items-center justify-center bg-gray-200">
            {currency.currency}
          </div>
          <div>
            <h3 className="font-bold text-lg">{currency.name}</h3>
            <p className="text-sm text-gray-500">
              {currency.quant} {currency.currency}
            </p>
          </div>
        </div>

        <div className="ml-auto grid grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-gray-500">Изменение за день</p>
            <p
              className={`font-bold ${
                currency.delta > 0
                  ? "text-green-600"
                  : currency.delta < 0
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {currency.delta > 0 ? "+" : ""}
              {currency.delta}
              {renderDeltaIcon(currency.index)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Изменение за месяц</p>
            <p className="font-bold text-green-600">
              +{monthlyChange}
              <ArrowUp className="inline-block ml-1 h-4 w-4" />
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Курс
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Изменение
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historicalData.map((item, index) => (
                <tr key={index} className={index === 0 ? "font-medium" : ""}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {item.value} ₸
                  </td>
                  <td
                    className={`px-4 py-2 whitespace-nowrap text-sm ${
                      item.direction === "UP"
                        ? "text-green-600"
                        : item.direction === "DOWN"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {item.change > 0 ? "+" : ""}
                    {item.change}
                    {renderDeltaIcon(item.direction)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <a href="#" className="text-red-600 flex items-center text-sm">
              Подробнее
            </a>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
