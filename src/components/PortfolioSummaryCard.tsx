import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import { PortfolioWithBalances } from '@zachweinberg/wealth-schema';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';

interface Props {
  portfolio: PortfolioWithBalances;
}

const PortfolioSummaryCard: React.FunctionComponent<Props> = ({ portfolio }: Props) => {
  return (
    <div className="flex-1 p-6 overflow-hidden transition-colors bg-white shadow cursor-pointer sm:rounded-lg hover:bg-blue0">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <p className="text-lg font-bold">{portfolio.name}</p>
            {portfolio.public && (
              <div className="px-3 py-1 ml-3 text-xs font-medium rounded-full bg-gray7 text-purple3">
                Public
              </div>
            )}
          </div>
          <div className="flex items-center text-green2">
            <div className="text-xl font-bold">
              {formatMoneyFromNumber(portfolio.totalValue)}
            </div>
            <div className="flex">
              {portfolio.dayChangePercent !== 0 && (
                <div className="mx-3 text-sm">
                  {formatPercentageChange(portfolio.dayChangePercent)}
                </div>
              )}
              <div className="self-end">
                {portfolio.dayChangePercent > 0 && (
                  <ChevronUpIcon className="w-4 h-4" aria-hidden="true" />
                )}
                {portfolio.dayChangePercent < 0 && (
                  <ChevronDownIcon className="w-4 h-4 text-red2" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="self-end">{/* <SmallChart /> */}</div>
      </div>

      <div className="grid grid-flow-row grid-cols-3 grid-rows-2 gap-4 mt-4 color">
        <div>
          <div className="text-base font-light portfolio-color">Stocks</div>
          <div className="mt-1 text-lg font-medium tracking-wide">
            {formatMoneyFromNumber(portfolio.stocksValue)}
          </div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Cryptocurrency</div>
          <div className="mt-1 text-lg font-medium tracking-wide">
            {formatMoneyFromNumber(portfolio.cryptoValue)}
          </div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Real Estate</div>
          <div className="mt-1 text-lg font-medium tracking-wide">
            {formatMoneyFromNumber(portfolio.realEstateValue)}
          </div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Cash</div>
          <div className="mt-1 text-lg font-medium tracking-wide">
            {formatMoneyFromNumber(portfolio.cashValue)}
          </div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Custom Assets</div>
          <div className="mt-1 text-lg font-medium tracking-wide">
            {formatMoneyFromNumber(portfolio.customsValue)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
