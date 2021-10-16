import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

type Data = { date: Date; balance: number };

interface Props {
  data: Array<Data>;
}

const NoDot = (props) => {
  return null;
};

const CustomTooltip = () => {
  return (
    <div className=" text-red w-full">
      <div className=" z-50">asdf</div>
    </div>
  );
};

const BalanceHistoryChart: React.FunctionComponent<Props> = ({ data }: Props) => {
  return data.length < 2 ? (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-gray text-md">No historical chart data yet. Check back soon!</p>
    </div>
  ) : (
    <ResponsiveContainer>
      <LineChart data={data} margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
        <Tooltip content={<CustomTooltip />} position={{ x: 0 }} />
        <Line
          dot={<NoDot />}
          type="linear"
          dataKey="balance"
          stroke="#CEF33C"
          strokeWidth={2}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceHistoryChart;
