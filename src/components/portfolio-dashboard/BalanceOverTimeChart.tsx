import { LineSeries, XYPlot } from 'react-vis';

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../../tailwind.config');
const { theme } = resolveConfig(tailwindConfig);

type Coords = Array<{ x: number; y: number }>;

interface Props {
  containerHeight: number;
  containerWidth: number;
}

interface DataPoint {
  x: number;
  y: number;
}

const BalanceOverTimeChart: React.FunctionComponent = () => {
  return (
    <div className="h-full w-full text-white rounded-3xl font-poppins bg-dark">
      <XYPlot height="100%" width="100%">
        <LineSeries
          data={[
            { x: 0, y: 8 },
            { x: 1, y: 5 },
            { x: 2, y: 4 },
            { x: 3, y: 9 },
            { x: 4, y: 1 },
            { x: 5, y: 7 },
            { x: 6, y: 6 },
            { x: 7, y: 3 },
            { x: 8, y: 2 },
            { x: 9, y: 0 },
          ]}
        />
      </XYPlot>
    </div>
  );
};

export default BalanceOverTimeChart;
