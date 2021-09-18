import { AssetType } from '@zachweinberg/wealth-schema';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import Typography from '../Typography';

interface Props {
  assetType: AssetType;
  amount: number;
  percent: number;
  strokeColor: string;
}

const AssetPercentCard: React.FunctionComponent<Props> = ({
  amount,
  percent,
  assetType,
  strokeColor,
}: Props) => {
  const strokeGray = '#D8DBE4';

  return (
    <div className="p-3 bg-white rounded-xl">
      <div className="grid items-center w-full h-full grid-cols-2 gap-2">
        <div className="hidden max-w-full mx-auto w-28 md:block">
          <svg viewBox="0 0 36 36">
            <path
              strokeWidth="2"
              stroke={strokeGray}
              fill="transparent"
              d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeWidth="2"
              stroke={strokeColor ?? strokeGray}
              fill="transparent"
              stroke-dasharray={`${percent * 100}, 100`}
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
              {formatPercentageChange(percent ?? 0)}
            </text>
          </svg>
        </div>
        <div className="m-auto">
          <Typography element="p" variant="Headline2" className="mb-2 text-dark">
            {assetType}
          </Typography>
          <Typography element="p" variant="Headline3" className="text-darkgray">
            {formatMoneyFromNumber(amount ?? 0)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default AssetPercentCard;
