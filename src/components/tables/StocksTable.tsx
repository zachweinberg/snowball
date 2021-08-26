import { StockPositionWithQuote } from '@zachweinberg/wealth-schema';
import classNames from 'classnames';
import { formatMoneyFromNumber } from '~/lib/money';

const headers = [
  'Ticker',
  'Quantity',
  'Last',
  'Market Value',
  'Day Change',
  'Cost Basis',
  'Gain/Loss',
];

interface Props {
  stocks: StockPositionWithQuote[];
}

const StocksTable: React.FunctionComponent<Props> = ({ stocks }: Props) => {
  return (
    <div className="min-w-full">
      <p className="text-purple3 font-semibold text-xl">Stocks</p>
      <table className="min-w-full">
        <tbody>
          <tr className="text-xs bg-white shadow-sm">
            {headers.map((header, i) => (
              <th
                key={i}
                className={classNames(
                  `px-6 py-4 font-medium tracking-wider text-left uppercase text-purple2`,
                  {
                    'rounded-bl-md rounded-tl-md': i === 0,
                    'rounded-br-md rounded-tr-md': i === headers.length - 1,
                  }
                )}
              >
                {header}
              </th>
            ))}
          </tr>
          {stocks.map((stock, i) => (
            <tr className="transition-colors bg-white shadow-sm cursor-pointer hover:bg-blue0">
              <td className="px-6 py-3 tracking-wider text-left truncate text-blue1 rounded-bl-md rounded-tl-md">
                <div className="text-sm font-bold">{stock.symbol}</div>
                <div className="w-40 text-sm font-medium text-left truncate text-purple2">
                  {stock.companyName}
                </div>
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {stock.quantity}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(stock.last)}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(stock.marketValue)}
              </td>
              <td
                className={classNames(
                  `px-6 py-3 text-sm font-medium tracking-wider text-left`,
                  stock.dayChange < 0 ? 'text-red2' : 'text-green2'
                )}
              >
                <i className="align-middle fas fa-sort-up"></i>
                {formatMoneyFromNumber(stock.dayChange)}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(stock.costBasis)}
              </td>
              <td
                className={classNames(
                  'px-6 py-3 tracking-wider text-left font-medium rounded-br-md text-sm rounded-tr-md',
                  stock.gainLoss < 0 ? 'text-red2' : 'text-green2'
                )}
              >
                <i className="fas fa-sort-up"></i> {formatMoneyFromNumber(stock.gainLoss)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StocksTable;
