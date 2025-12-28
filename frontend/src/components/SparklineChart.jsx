import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

export default function SparklineChart({ data = [] }) {
  const labels = data.map((_, i) => i + 1);
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Leads',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        tension: 0.3,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } }
  };

  return <div className="w-full h-28"><Line data={chartData} options={options} /></div>;
}
