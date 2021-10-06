import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer } from 'recharts';

type Data = { date: Date; balance: number };

interface Props {
  data: Array<Data>;
}

const BalanceHistoryChart: React.FunctionComponent<Props> = ({ data }: Props) => {
  const CustomizedDot = (props) => {
    const { cx, cy, index } = props;

    if (index !== data.length - 1) {
      return null;
    }

    return (
      <svg x={cx - 10} y={cy - 10} width={50} height={50} fill="green" viewBox="0 0 40 40">
        <circle cx="20" cy="20" fill="green" r="0" />
      </svg>
    );
  };

  return data.length < 2 ? (
    <div className="flex items-center justify-center w-full h-full">
      <p className="text-gray text-md">No historical chart data yet. Check back soon!</p>
    </div>
  ) : (
    <ResponsiveContainer debounce={180}>
      <LineChart data={data}>
        <CartesianGrid
          strokeDasharray="5"
          vertical={false}
          horizontal
          stroke="#4F4F4F"
          strokeWidth={1}
        />
        {/* <Tooltip /> */}
        <Line
          // activeDot
          dot={<CustomizedDot />}
          type="linear"
          dataKey="balance"
          stroke="#CEF33C"
          strokeWidth={3}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BalanceHistoryChart;
