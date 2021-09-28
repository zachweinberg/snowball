import React from 'react';
import { Area, AreaChart } from 'recharts';

type Data = { date: number; balance: number };

interface Props {
  width: number;
  height: number;
  data: Array<Data>;
}

const background = '#3b6978';
const accentColor = '#00565B';
const accentColorDark = '#757784';

const Sparkline: React.FunctionComponent<Props> = ({ data, width, height }: Props) => {
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
