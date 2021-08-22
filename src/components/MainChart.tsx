import { ChartData, ChartOptions } from 'chart.js';
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';

const data: ChartData = {
  labels: [
    '7/2',
    '7/3',
    '10/4',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
    '12/4',
    '12/8',
  ],
  datasets: [
    {
      data: [50, 49, 50, 51, 52, 53, 54, 54, 53, 54, 54, 54, 53, 53, 52, 53, 54, 55, 55, 60, 57, 53, 51, 50, 49],
      backgroundColor: '#1FD0A3',
      borderColor: '#1FD0A3',
      tension: 0.3,
      pointHoverRadius: 6,
      pointBorderColor: '#fff',
      animation: { duration: 0 },
    },
  ],
};

const MainChart = () => {
  const balanceTextRef = useRef<HTMLParagraphElement>(null);

  const options: ChartOptions = {
    animation: {
      duration: 0,
    },
    hover: { intersect: false, mode: 'nearest' },
    color: '#ccc',
    responsive: true,
    elements: { point: { radius: 0 } },
    maintainAspectRatio: true,
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: { display: false },
    },
    layout: {
      padding: {
        top: 20,
        bottom: 4,
      },
    },
    onHover: (el) => {
      if (!balanceTextRef || balanceTextRef.current === null) {
        return;
      }

      const balance = el.x;

      balanceTextRef.current.innerText = balance;
    },
    scales: {
      xAxes: {
        grid: { display: false },
        display: true,
        ticks: {
          callback: (val) => {
            return Number(val) % 4 === 0 ? val : '';
          },
          color: '#dadada',
          font: { size: 12 },
        },
      },
      yAxes: {
        grid: { display: false },
        display: false,
        offset: true,
      },
    },
  };

  return (
    <div className="relative rounded-md bg-blue4">
      <div className="absolute text-white left-5 top-3">
        <p className="text-2xl font-bold">Balance over time</p>
        <p className="text-lg font-medium" ref={balanceTextRef}>
          124
        </p>
      </div>
      <Line data={data} options={options} height={65} />
    </div>
  );
};

export default MainChart;
