import { curveLinear } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridRows } from '@visx/grid';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Area, Bar, Line } from '@visx/shape';
import { defaultStyles, Tooltip, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { bisector, extent, max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import React, { useCallback, useMemo } from 'react';

type Data = { date: number; balance: number };

interface Props {
  data: Array<Data>;
  width: number;
  height: number;
}

const background = '#3b6978';
const accentColor = '#00565B';
const accentColorDark = '#757784';

type TooltipData = Data;

const tooltipStyles = {
  ...defaultStyles,
  background,
  border: '1px solid white',
  color: 'white',
};

const formatDate = timeFormat("%b %d, '%y");

const getDate = (d: Data) => new Date(d.date);
const getStockValue = (d: Data) => d.balance;
const bisectDate = bisector<Data, Date>((d) => new Date(d.date)).left;

const margin = 32;

const BalanceHistoryChart = withTooltip<Props, TooltipData>(
  ({
    data,
    width,
    height,
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  }: Props & WithTooltipProvidedProps<TooltipData>) => {
    if (width < 10) return null;
    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2;

    const dateScale = useMemo(
      () =>
        scaleTime({
          range: [margin, innerWidth + margin],
          domain: extent(data, getDate) as [Date, Date],
        }),
      [innerWidth, margin]
    );

    const stockValueScale = useMemo(
      () =>
        scaleLinear({
          range: [innerHeight + margin, margin],
          domain: [0, (max(data, getStockValue) || 0) + innerHeight / 3],
          nice: true,
        }),
      [margin, innerHeight]
    );

    const handleTooltip = useCallback(
      (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
        const { x } = localPoint(event) || { x: 0 };
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
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: stockValueScale(getStockValue(d)),
        });
      },
      [showTooltip, stockValueScale, dateScale]
    );

    return (
      <div>
        <svg width={width} height={height}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            fill="url(#area-background-gradient)"
            rx={14}
          />
          <LinearGradient
            id="area-gradient"
            from={accentColor}
            to={accentColor}
            toOpacity={0}
          />
          <GridRows
            left={margin}
            scale={stockValueScale}
            width={innerWidth}
            strokeDasharray="10,9"
            stroke="#4F4F4F"
            strokeOpacity={1}
            pointerEvents="none"
          />
          <Area<Data>
            data={data}
            x={(d) => dateScale(getDate(d)) ?? 0}
            y={(d) => stockValueScale(getStockValue(d)) ?? 0}
            strokeWidth={3}
            stroke="#CEF33C"
            curve={curveLinear}
          />
          <Bar
            y={margin}
            x={margin}
            width={innerWidth}
            height={innerHeight}
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
                from={{ x: tooltipLeft, y: margin }}
                to={{ x: tooltipLeft, y: innerHeight + margin }}
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + 1}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
        </svg>
        {tooltipData && (
          <div>
            <TooltipWithBounds
              key={Math.random()}
              top={tooltipTop - 12}
              left={tooltipLeft + 12}
              style={tooltipStyles}
            >
              {`$${getStockValue(tooltipData)}`}
            </TooltipWithBounds>
            <Tooltip
              top={innerHeight + margin - 14}
              left={tooltipLeft}
              style={{
                ...defaultStyles,
                minWidth: 72,
                textAlign: 'center',
                transform: 'translateX(-50%)',
              }}
            >
              {formatDate(getDate(tooltipData))}
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);

export default BalanceHistoryChart;
