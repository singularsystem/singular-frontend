"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: number[][] | undefined;
  labels: string[] | undefined;
  legends: string[];
  colors?: string[];
}

export function LineChart({ data, labels, legends, colors }: LineChartProps) {
  // Verificar se os dados e labels são válidos
  if (!data || !labels || !data.length || !labels.length) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

  const defaultColors = ["#2563eb", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];
  const usedColors = colors || defaultColors;

  const datasets = data.map((dataSet, index) => ({
    label: legends[index] || `Série ${index + 1}`,
    data: dataSet,
    borderColor: usedColors[index % usedColors.length],
    backgroundColor: usedColors[index % usedColors.length].replace(
      "1)",
      "0.2)"
    ),
    tension: 0.1,
  }));

  const chartData = {
    labels,
    datasets,
  };

  const options = {
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

  return <Line data={chartData} options={options} />;
}
