import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function LineChart({ labels = [], series = [], label = 'Series' }) {
  const data = {
    labels,
    datasets: [
      {
        label,
        data: series,
        fill: true,
        backgroundColor: 'rgba(59,130,246,0.12)',
        borderColor: '#3b82f6',
        tension: 0.35,
        pointRadius: 3
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  return <Line data={data} options={options} />;
}
