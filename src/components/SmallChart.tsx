import React from 'react';
import { Line } from 'react-chartjs-2';

const buildData = ({ chartData }) => ({
  type: 'line',
  labels: chartData.labels,
  datasets: [
    {
      label: '',
      borderWidth: 1,
      borderColor: 'rgba(31, 208, 163, 1)',
      backgroundColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;
        if (!chartArea) {
          return null;
        }
        let grad = ctx.createLinearGradient(50, 90, 50, 0);
        grad.addColorStop(0.0489, 'rgba(31, 208, 163, 0)');
        grad.addColorStop(1, 'rgba(31, 208, 163, 1)');

        return grad;
      },
      data: chartData.data,
      tension: 0.2,
      showLine: true,
      fill: true,
    },
  ],
});

const options = {
  animation: {
    duration: 0,
  },
  legend: {
    position: 'bottom',
  },
  elements: {
    point: {
      radius: 0,
      tension: 1,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const info = {
  stockFullName: 'SW Limited.',
  stockShortName: 'ASX:SFW',
  price: {},
  chartData: {
    labels: ['10:00', '', '12:00', '', '2:00', '', '4:00'],
    data: [100, 50000, 500000, 200000, 500000, 500005, 500000, 500000],
  },
};

const SmallChart: React.FunctionComponent = () => {
  const data = buildData(info);

  return (
    <>
      <div className="w-24">
        <Line data={data} options={options} />
      </div>
    </>
  );
};

export default SmallChart;
