import React from 'react';
import { Area, AreaChart } from 'recharts';

type Data = { date: Date; balance: number };

interface Props {
  width: number;
  height: number;
  data: Array<Data>;
}

const Sparkline: React.FunctionComponent<Props> = ({ data, width, height }: Props) => {
  if (data.length < 2) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="font-xs text-darkgray">No historical chart data yet</p>
      </div>
    );
  }
  return (
    <AreaChart width={width} height={height} data={data}>
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="25%" stopColor="#C2D6D8" stopOpacity={0.98} />
          <stop offset="95%" stopColor="#C2D6D8" stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="linear"
        strokeWidth={3}
        dataKey="balance"
        stroke="#00565B"
        fillOpacity={1}
        fill="url(#gradient)"
      />
    </AreaChart>
  );
};

export default Sparkline;
