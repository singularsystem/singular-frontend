"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: number[] | undefined;
  labels: string[] | undefined;
  legend: string;
  horizontal?: boolean;
  colors?: string[];
}

export function BarChart({
  data,
  labels,
  legend,
  horizontal = false,
  colors,
}: BarChartProps) {
  // Verificar se os dados e labels são válidos
  if (!data || !labels || !data.length || !labels.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: legend,
        data,
        backgroundColor: colors || [
          "rgba(59, 130, 246, 0.6)", // blue
          "rgba(239, 68, 68, 0.6)", // red
          "rgba(245, 158, 11, 0.6)", // amber
          "rgba(16, 185, 129, 0.6)", // emerald
          "rgba(139, 92, 246, 0.6)", // violet
        ],
        borderColor: colors
          ? colors.map((color) => color)
          : [
              "rgba(59, 130, 246, 1)",
              "rgba(239, 68, 68, 1)",
              "rgba(245, 158, 11, 1)",
              "rgba(16, 185, 129, 1)",
              "rgba(139, 92, 246, 1)",
            ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? "y" : "x",
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
