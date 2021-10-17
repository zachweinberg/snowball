import { localPoint } from '@visx/event';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Area, Bar, Line } from '@visx/shape';
import { useTooltip } from '@visx/tooltip';
import { bisector, extent, max } from 'd3-array';
import React, { useCallback, useMemo, useState } from 'react';
import { formatMoneyFromNumber } from '~/lib/money';

interface ChartData {
  balance: number;
  date: Date;
}

interface SVGChartProps {
  data: ChartData[];
  width: number;
  height: number;
}

const getDate = (d: ChartData) => new Date(d.date);
const getBalance = (d: ChartData) => d.balance;
const bisectDate = bisector<ChartData, Date>((d) => new Date(d.date)).left;

const SVGChart: React.FunctionComponent<SVGChartProps> = (props: SVGChartProps) => {
  const { width, height, data } = props;
  const [tooltipBalance, setTooltipBalance] = useState(data[data.length - 1].balance);
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } =
    useTooltip();

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [0, width],
        domain: extent(data, getDate) as [Date, Date],
      }),
    [width]
  );

  const stockValueScale = useMemo(
    () =>
      scaleLinear({
        range: [height, 0],
        domain: [0, (max(data, getBalance) || 0) + height / 3],
        nice: true,
      }),
    [height]
  );

  const handleTooltip = useCallback(
    (e: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
      const { x } = localPoint(e) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(data, x0, 1);
      const d0 = data[index - 1];
      const d1 = data[index];
      let d = d0;

      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }

      setTooltipBalance(d.balance);

      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: stockValueScale(getBalance(d)),
      });
    },
    [showTooltip, stockValueScale, dateScale]
  );

  if (width < 10) return null;

  return (
    <div className="relative">
      <div className="absolute flex justify-between w-full px-3 py-2 text-white">
        <div className="p-1">
          <p className="mb-1 text-lg font-semibold bg-dark">Balance over time</p>
          <p className="font-medium">{formatMoneyFromNumber(tooltipBalance)}</p>
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium bg-dark">
          <div className="p-1 rounded-full cursor-pointer hover:bg-lime hover:text-dark">
            1D
          </div>
          <div className="p-1 rounded-full cursor-pointer hover:bg-lime hover:text-dark">
            1W
          </div>
          <div className="p-1 rounded-full cursor-pointer hover:bg-lime hover:text-dark">
            1M
          </div>
          <div className="p-1 rounded-full cursor-pointer hover:bg-lime hover:text-dark">
            6M
          </div>
          <div className="p-1 rounded-full cursor-pointer hover:bg-lime hover:text-dark">
            1Y
          </div>
          <div className="p-1 rounded-full cursor-pointer hover:bg-lime hover:text-dark">
            All
          </div>
        </div>
      </div>

      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#141414" rx={15} />
        <Area<ChartData>
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getBalance(d)) ?? 0}
          strokeWidth={2}
          stroke="#CEF33C"
        />
        <Bar
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />

        {tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: 0 }}
              to={{ x: tooltipLeft, y: height }}
              stroke={'#F9FAFF'}
              strokeWidth={2}
              opacity={0.6}
              pointerEvents="none"
              strokeDasharray="3"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

interface Props {
  data: ChartData[];
}

const BalanceOverTime: React.FunctionComponent<Props> = ({ data }: Props) => {
  return (
    <ParentSize>
      {(parent) => <SVGChart data={data} width={parent.width} height={parent.height} />}
    </ParentSize>
  );
};

export default BalanceOverTime;
