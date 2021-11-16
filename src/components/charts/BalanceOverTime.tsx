import { Axis } from '@visx/axis';
import { localPoint } from '@visx/event';
import { ParentSize } from '@visx/responsive';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Bar, Line, LinePath } from '@visx/shape';
import { useTooltip } from '@visx/tooltip';
import { DailyBalance, DailyBalancesPeriod } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import { bisector, extent, max, min } from 'd3-array';
import { DateTime } from 'luxon';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Spinner from '~/components/ui/Spinner';
import { API } from '~/lib/api';
import { formatMoneyFromNumber } from '~/lib/money';

interface ChartData {
  balance: number;
  date: Date;
}

interface SVGChartProps {
  data: ChartData[];
  width: number;
  height: number;
  onHoverPoint: (data: ChartData) => void;
  reset: () => void;
}

const getDate = (d: ChartData) => new Date(d.date);
const getBalance = (d: ChartData) => d?.balance ?? 0;
const bisectDate = bisector<ChartData, Date>((d) => new Date(d.date)).left;

const SVGChart: React.FunctionComponent<SVGChartProps> = (props: SVGChartProps) => {
  const { width, height, data, onHoverPoint, reset } = props;
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft } = useTooltip();

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
        domain: [min(data, getBalance) || 0, max(data, getBalance) || 0],
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

      onHoverPoint(d);

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
      <svg width={width} height={height}>
        <LinePath
          data={data}
          x={(d) => dateScale(getDate(d)) ?? 0}
          y={(d) => stockValueScale(getBalance(d)) ?? 0}
          stroke="#CEF33C"
          strokeWidth={2}
        />
        <Bar
          width={width}
          height={height}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => {
            reset();
            hideTooltip();
          }}
        />
        <Axis
          scale={dateScale}
          top={height}
          orientation="top"
          stroke={'#ccc'}
          strokeWidth={0}
          tickStroke={'#ccc'}
          tickLabelProps={() => ({
            fill: 'yellow',
            textAnchor: 'middle',
            verticalAnchor: 'middle',
            fontSize: ' .65rem',
          })}
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

const PERIOD_MAP = {
  '1D': DailyBalancesPeriod.OneDay,
  '1W': DailyBalancesPeriod.OneWeek,
  '1M': DailyBalancesPeriod.OneMonth,
  '6M': DailyBalancesPeriod.SixMonths,
  '1Y': DailyBalancesPeriod.OneYear,
  All: DailyBalancesPeriod.AllTime,
};

const BalanceOverTime: React.FunctionComponent<{ portfolioID: string }> = ({
  portfolioID,
}: {
  portfolioID: string;
}) => {
  const [period, setPeriod] = useState<DailyBalancesPeriod>(DailyBalancesPeriod.AllTime);
  const [data, setData] = useState<DailyBalance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [point, setPoint] = useState<ChartData | null>(null);

  const loadDailyBalanceHistory = async () => {
    setLoading(true);
    try {
      const response = await API.getPortfolioDailyBalances(portfolioID, period);
      setData(response.dailyBalances);
    } catch (err) {
      //
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDailyBalanceHistory();
  }, [period]);

  return (
    <ParentSize>
      {(parent) => (
        <div
          className="flex flex-col justify-between rounded-xl bg-dark"
          style={{ width: `${parent.width}px`, height: `${parent.height}px` }}
        >
          <div
            className="flex items-center justify-between w-full px-3"
            style={{ height: parent.height * 0.15 }}
          >
            <h1 className="text-lg font-semibold text-white">Balance over time</h1>
            <div className="text-white">
              <div className="flex items-center space-x-1 text-sm font-medium bg-dark">
                {Object.entries(PERIOD_MAP).map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => setPeriod(value)}
                    className={classNames(
                      'rounded-full p-1 text-sm cursor-pointer hover:bg-lime hover:text-dark',
                      { 'bg-lime text-dark': period === value }
                    )}
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="mx-auto">
              <Spinner size={34} color="#CEF33C" />
            </div>
          ) : (
            <SVGChart
              reset={() =>
                setPoint({
                  balance: data[data.length - 1]?.totalValue ?? 0,
                  date: data[data.length - 1]?.date ?? new Date(),
                })
              }
              onHoverPoint={(d) => setPoint(d)}
              data={data.map((d) => ({ balance: d.totalValue, date: d.date }))}
              width={parent.width}
              height={parent.height * 0.65}
            />
          )}

          <div style={{ height: parent.height * 0.2 }} className="px-3 flex items-center">
            <p className="text-2xl font-bold text-white mr-4">
              {formatMoneyFromNumber(point?.balance ?? 0)}
            </p>
            {point && (
              <p className="text-md font-medium text-lime">
                {DateTime.fromJSDate(point.date).toLocaleString(DateTime.DATE_MED)}
              </p>
            )}
          </div>
        </div>
      )}
    </ParentSize>
  );
};

export default BalanceOverTime;
