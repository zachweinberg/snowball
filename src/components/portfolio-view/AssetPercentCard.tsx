import { AssetType } from '@zachweinberg/wealth-schema';
import PercentageCircle from '~/components/ui/PercentageCircle';
import { formatMoneyFromNumber } from '~/lib/money';

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
  return (
    <div className="p-3 bg-white border rounded-xl border-bordergray">
      <div className="grid items-center w-full h-full grid-cols-2 gap-2">
        <div className="hidden max-w-full mx-auto w-28 md:block">
          <PercentageCircle percentDecimal={percentDecimal} strokeColor={strokeColor} />
        </div>
        <div className="m-auto">
          <p className="mb-2 font-bold text-[1.25rem]">{assetType}</p>
          <p className="text-darkgray font-semibold text-[1rem]">
            {formatMoneyFromNumber(amount ?? 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetPercentCard;
