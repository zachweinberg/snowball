import { formatPercentageChange } from '~/lib/money';

interface Props {
  percentDecimal: number;
  strokeColor: string;
  className?: string;
}

const PercentageCircle: React.FunctionComponent<Props> = ({
  percentDecimal,
  strokeColor,
  className,
}: Props) => {
  const STROKE_GRAY = '#D8DBE4';

  return (
    <svg viewBox="0 0 36 36" className={className}>
      <path
        strokeWidth="2"
        stroke={STROKE_GRAY}
        fill="transparent"
        d="M18 2.0845
    a 15.9155 15.9155 0 0 1 0 31.831
    a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        strokeWidth="2"
        stroke={strokeColor ?? STROKE_GRAY}
        fill="transparent"
        strokeDasharray={`${percentDecimal * 100}, 100`}
        d="M18 2.0845
    a 15.9155 15.9155 0 0 1 0 31.831
    a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        className="font-semibold text-dark font-poppins"
        fontSize="44%"
        dy=".3em"
      >
        {formatPercentageChange(percentDecimal ?? 0)}
      </text>
    </svg>
  );
};

export default PercentageCircle;
