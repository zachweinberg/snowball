import { useEffect, useState } from 'react';

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../../tailwind.config');
const { theme } = resolveConfig(tailwindConfig);

type Coords = Array<{ x: number; y: number }>;

interface Props {
  height: number;
  width: number;
}

const BalanceOverTimeChart: React.FunctionComponent<Props> = ({ height, width }: Props) => {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState<Coords>([]);

  useEffect(() => {
    const randomPoints: Coords = [];

    for (let element = 0; element < 20; element++) {
      const y = Math.floor(Math.random() * 50) + 50;
      randomPoints.push({
        x: element,
        y,
      });
    }

    setCoords(randomPoints);
    setLoading(false);
  }, []);

  return (
    <div className="h-full px-5 py-4 text-white rounded-3xl font-poppins bg-dark">
      {!loading && (
        <svg viewBox="0 0 100% 100%">
          <path d="M 0 0 L 100 200 z" strokeWidth="2" stroke={theme.colors.lime} />
        </svg>
      )}
    </div>
  );
};

export default BalanceOverTimeChart;
