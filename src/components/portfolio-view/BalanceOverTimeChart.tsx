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
  return <div className="w-full h-full text-white rounded-3xl font-poppins bg-dark"></div>;
};

export default BalanceOverTimeChart;
