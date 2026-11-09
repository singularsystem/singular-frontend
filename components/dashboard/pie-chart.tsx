"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: number[] | undefined;
  labels: string[] | undefined;
  colors: string[];
  borderColors?: string[];
  title?: string;
}

export function PieChart({
  data,
  labels,
  colors,
  borderColors,
  title,
}: PieChartProps) {
  // Verificar se os dados e labels são válidos
  if (!data || !labels || !data.length || !labels.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  // Garantir que temos cores suficientes
  const usedColors = colors.slice(0, data.length);
  const usedBorderColors = borderColors
    ? borderColors.slice(0, data.length)
    : usedColors;

  const chartData = {
    labels,
    datasets: [
      {
        label: title || "Dados",
        data,
        backgroundColor: usedColors,
        borderColor: usedBorderColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 11,
          },
        },
      },
      title: title
        ? {
            display: true,
            text: title,
            font: {
              size: 14,
            },
          }
        : undefined,
    },
  };

  return <Pie data={chartData} options={options} />;
}
