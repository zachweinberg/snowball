import { ChevronDownIcon } from '@heroicons/react/outline';
import { NextPage } from 'next';
import React from 'react';
import LineChart from '~/components/LineChart';

const ChartTest: NextPage = () => {
  return (
    <div
      className="max-w-3xl p-8 mx-auto mt-10 text-white rounded-3xl font-poppins"
      style={{ backgroundColor: '#141414' }}
    >
      <div className="flex items-center justify-between w-full mb-8">
        <h1 className="text-2xl font-semibold">Growth</h1>
        <div className="flex items-center">
          <div className="mr-2 text-xl font-medium whitespace-nowrap">All-time</div>
          <ChevronDownIcon className="w-7 h-7" />
        </div>
      </div>

      <LineChart
        width={700}
        height={300}
        precision={2}
        horizontalGuides={8}
        data={[
          { value: 10000, label: '9/2/2021' },
          { value: 10400, label: '9/3/2021' },
          { value: 10600, label: '9/4/2021' },
          { value: 10500, label: '9/5/2021' },
          { value: 10700, label: '9/6/2021' },
          { value: 10600, label: '9/7/2021' },
          { value: 11200, label: '9/8/2021' },
          { value: 13200, label: '9/9/2021' },
        ]}
      />
    </div>
  );
};

export default ChartTest;
