import { AssetType } from '@zachweinberg/wealth-schema';
import { formatMoneyFromNumber } from '~/lib/money';
import PercentageCircle from '../ui/PercentageCircle';
import Typography from '../ui/Typography';

interface Props {
  assetType: AssetType;
  amount: number;
  percentDecimal: number;
  strokeColor: string;
}

const AssetPercentCard: React.FunctionComponent<Props> = ({
  amount,
  percentDecimal,
  assetType,
  strokeColor,
}: Props) => {
  const strokeGray = '#D8DBE4';

  return (
    <div className="p-3 bg-white rounded-xl">
      <div className="grid items-center w-full h-full grid-cols-2 gap-2">
        <div className="hidden max-w-full mx-auto w-28 md:block">
          <PercentageCircle percentDecimal={percentDecimal} strokeColor={strokeColor} />
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
