import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ data = {} }) {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        data: data.values || [],
        backgroundColor: data.colors || ['#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 6
      }
    ]
  };

  const options = { responsive: true, plugins: { legend: { position: 'bottom' } } };

  return <Doughnut data={chartData} options={options} />;
}
