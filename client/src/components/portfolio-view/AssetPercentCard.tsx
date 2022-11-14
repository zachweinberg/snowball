import { AssetType } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import PercentageCircle from '~/components/ui/PercentageCircle';
import { formatMoneyFromNumber } from '~/lib/money';

interface Props {
  assetType: AssetType;
  amount: number;
  percentDecimal: number;
  strokeColor: string;
  onClick: () => void;
  selected: boolean;
}

const AssetPercentCard: React.FunctionComponent<Props> = ({
  amount,
  percentDecimal,
  assetType,
  strokeColor,
  selected,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={classNames(
        'p-2 bg-white border rounded-md border-bordergray cursor-pointer hover:border-darkgray transition-colors',
        {
          'bg-light shadow-md border-darkgray': selected,
        }
      )}
    >
      <div className="grid items-center w-full h-full grid-cols-1 md:grid-cols-2 gap-1">
        <div className="hidden max-w-full mx-auto w-24 md:block">
          <PercentageCircle
            percentDecimal={isNaN(percentDecimal) ? 0 : percentDecimal}
            strokeColor={strokeColor}
          />
        </div>
        <div className="m-auto">
          <p className="mb-2 font-bold text-[1.25rem]">{assetType}</p>
          <p className="text-darkgray font-semibold text-[1rem]">
            {formatMoneyFromNumber(amount ?? 0, true)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetPercentCard;
