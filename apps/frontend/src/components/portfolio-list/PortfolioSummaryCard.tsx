import { AssetColor, PortfolioWithBalances } from 'schema';
import classNames from 'classnames';
import React from 'react';
import PercentageCircle from '~/components/ui/PercentageCircle';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import Sparkline from '../charts/Sparkline';

interface Props {
  portfolio: PortfolioWithBalances;
}

const PortfolioSummaryCard: React.FunctionComponent<Props> = ({ portfolio }: Props) => {
  return (
    <div className="transition-all bg-white border rounded-md shadow-sm p-7 border-bordergray hover:shadow-md">
      <div className="flex justify-between pb-8 border-b border-bordergray">
        <div className="flex flex-col justify-between">
          <div className="flex items-center mb-3">
            <h2 className="text-darkgray font-semibold text-[1.1rem] mr-2">
              {portfolio.name}
            </h2>
            {portfolio.settings.private === false && (
              <p className="px-2 py-1 text-xs font-medium rounded-full text-darkgray bg-gray">
                Public
              </p>
            )}
          </div>

          <p className="mb-4 font-bold text-dark text-[1.75rem]">
            {formatMoneyFromNumber(portfolio.totalValue)}
          </p>
          <div className="flex items-center">
            {portfolio.totalValue === 0 && (
              <svg
                viewBox="0 0 10 10"
                className="w-2 h-3 fill-current text-darkgray"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="5" cy="5" r="5" />
              </svg>
            )}
            <div className="ml-3">
              <p className="mb-1 text-sm font-medium text-darkgray">Day Change</p>
              <p
                className={classNames(
                  'font-semibold text-[1rem]',
                  portfolio.totalValue === 0
                    ? 'text-darkgray'
                    : portfolio.dayChange < 0
                    ? 'text-red'
                    : 'text-evergreen'
                )}
              >
                {formatMoneyFromNumber(portfolio.dayChange)} (
                {formatPercentageChange(portfolio.dayChangePercent)})
              </p>
            </div>
          </div>
        </div>
        <div>
          <Sparkline
            width={225}
            height={105}
            data={portfolio.dailyBalances.slice(0, 30).map((bal) => ({
              balance: bal.totalValue,
              date: bal.date,
            }))}
          />
          {portfolio.dailyBalances.length > 2 && (
            <p className="text-xs text-center text-darkgray">30 Day History</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-8">
        <AssetSummary
          label="Stocks"
          amount={portfolio.stocksValue}
          percentInt={portfolio.stocksValue / portfolio.totalValue}
          color={AssetColor.Stocks}
        />
        <AssetSummary
          label="Crypto"
          amount={portfolio.cryptoValue}
          percentInt={portfolio.cryptoValue / portfolio.totalValue}
          color={AssetColor.Crypto}
        />
        <AssetSummary
          label="Real Estate"
          amount={portfolio.realEstateValue}
          percentInt={portfolio.realEstateValue / portfolio.totalValue}
          color={AssetColor.RealEstate}
        />
        <AssetSummary
          label="Cash"
          amount={portfolio.cashValue}
          percentInt={portfolio.cashValue / portfolio.totalValue}
          color={AssetColor.Cash}
        />
        <AssetSummary
          label="Custom Assets"
          amount={portfolio.customsValue}
          percentInt={portfolio.customsValue / portfolio.totalValue}
          color={AssetColor.Custom}
        />
      </div>
    </div>
  );
};

const AssetSummary = React.memo(
  ({
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
  }
);

export default React.memo(PortfolioSummaryCard);
