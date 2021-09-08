import { ChevronDownIcon } from '@heroicons/react/outline';
import { ChartData, ChartOptions } from 'chart.js';
import { NextPage } from 'next';
import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';

const data: ChartData = {
  labels: ['a', 'b', '', ''],
  datasets: [
    {
      data: [1, 2, 3, 5, 7, 6, 7, 6, 8, 14, 12, 12, 15, 16, 15, 15, 16, 17, 18],
      tension: 0.5,
      pointHoverRadius: 10,
    },
  ],
};

const Chart: React.FunctionComponent = () => {
  const balanceTextRef = useRef<HTMLParagraphElement>(null);

  const options: ChartOptions = {
    animation: {
      duration: 0,
    },
    hover: { intersect: false, mode: 'nearest' },
    color: 'red',
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

      // const balance = el.x;

      // balanceTextRef.current.innerText = balance;
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

  return <Line data={data} options={options} height={65} />;
};

const ChartTest: NextPage = () => {
  return (
    <div
      className="max-w-3xl p-8 mx-auto mt-10 text-white rounded-3xl font-poppins"
      style={{ backgroundColor: '#141414' }}
    >
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold">Growth</h1>
        <div className="flex items-center">
          <div className="mr-2 text-xl font-medium whitespace-nowrap">All-time</div>
          <ChevronDownIcon className="w-7 h-7" />
        </div>
      </div>
      <Chart />
    </div>
  );
};

export default ChartTest;
