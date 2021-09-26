import { PortfolioWithBalances } from '@zachweinberg/wealth-schema';
import classNames from 'classnames';
import PercentageCircle from '~/components/ui/PercentageCircle';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import Sparkline from '../charts/Sparkline';

interface Props {
  portfolio: PortfolioWithBalances;
}

const PortfolioSummaryCard: React.FunctionComponent<Props> = ({ portfolio }: Props) => {
  return (
    <div className="transition-shadow bg-white border shadow-sm hover:shadow-md rounded-3xl p-7 border-bordergray">
      <div className="flex justify-between pb-8 border-b border-bordergray">
        <div className="flex flex-col justify-between">
          <h2 className="mb-3 text-darkgray font-semibold text-[1rem]">{portfolio.name}</h2>
          <p className="mb-3 font-bold text-dark text-[1.75rem]">
            {formatMoneyFromNumber(portfolio.totalValue)}
          </p>
          <div className="flex items-center">
            {portfolio.totalValue === 0 ? (
              <svg
                viewBox="0 0 10 10"
                className="w-2 h-3 fill-current text-darkgray"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 12 10"
                className="w-2 h-3 fill-current"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 0L12 10H0L6 0Z" />
              </svg>
            )}
            <p
              className={classNames(
                'ml-2 font-semibold text-[1rem]',
                portfolio.totalValue === 0 ? 'text-darkgray' : 'text-evergreen'
              )}
            >
              {formatMoneyFromNumber(portfolio.dayChange)} (
              {formatPercentageChange(portfolio.dayChangePercent)})
            </p>
          </div>
        </div>
        <div>
          <Sparkline
            width={225}
            height={100}
            data={[
              { balance: 9876, date: 1632690171489 },
              { balance: 9817, date: 1632690171813 },
              { balance: 9400, date: 1632690171910 },
              { balance: 10403, date: 1632690171950 },
              { balance: 15403, date: 1632690174950 },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-8">
        <AssetSummary
          label="Stocks"
          amount={portfolio.stocksValue}
          percentInt={portfolio.stocksValue / portfolio.totalValue}
          color="green"
        />
        <AssetSummary
          label="Crypto"
          amount={portfolio.cryptoValue}
          percentInt={portfolio.cryptoValue / portfolio.totalValue}
          color="red"
        />
        <AssetSummary
          label="Real Estate"
          amount={portfolio.realEstateValue}
          percentInt={portfolio.realEstateValue / portfolio.totalValue}
          color="red"
        />
        <AssetSummary
          label="Cash"
          amount={portfolio.cashValue}
          percentInt={portfolio.cashValue / portfolio.totalValue}
          color="red"
        />
        <AssetSummary
          label="Custom Assets"
          amount={portfolio.customsValue}
          percentInt={portfolio.customsValue / portfolio.totalValue}
          color="red"
        />
      </div>
    </div>
  );
};

const AssetSummary = ({
  percentInt,
  amount,
  label,
  color,
}: {
  percentInt: number;
  amount: number;
  label: string;
  color: string;
}) => {
  return (
    <div className="flex items-center">
      <PercentageCircle
        percentDecimal={isNaN(percentInt) ? 0 : percentInt}
        strokeColor={color}
        className="w-16"
      />
      <div className="ml-3">
        <p className="mb-2 text-[1rem] font-semibold">{formatMoneyFromNumber(amount)}</p>
        <p className="text-darkgray text-[.95rem] font-semibold">{label}</p>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
