import { CryptoPositionWithQuote } from '@zachweinberg/wealth-schema';
import classNames from 'classnames';
import { formatMoneyFromNumber } from '~/lib/money';

const headers = [
  'Coin',
  'Quantity',
  'Last',
  'Market Value',
  'Day Change',
  'Cost Basis',
  'Gain/Loss',
];

interface Props {
  crypto: CryptoPositionWithQuote[];
}

const CryptoTable: React.FunctionComponent<Props> = ({ crypto }: Props) => {
  return (
    <div className="min-w-full">
      <p className="text-xl font-semibold text-purple3">Crypto</p>
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
          {crypto.map((coin, i) => (
            <tr className="transition-colors bg-white shadow-sm cursor-pointer hover:bg-blue0">
              <td className="px-6 py-3 tracking-wider text-left truncate text-blue1 rounded-bl-md rounded-tl-md">
                <div className="text-sm font-bold">{coin.symbol}</div>
                <div className="w-40 text-sm font-medium text-left truncate text-purple2">
                  {coin.coinName}
                </div>
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {coin.quantity}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(coin.last)}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(coin.marketValue)}
              </td>
              <td
                className={classNames(
                  `px-6 py-3 text-sm font-medium tracking-wider text-left`,
                  coin.dayChange < 0 ? 'text-red2' : 'text-green2'
                )}
              >
                <i className="align-middle fas fa-sort-up"></i>
                {formatMoneyFromNumber(coin.dayChange)}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(coin.costBasis)}
              </td>
              <td
                className={classNames(
                  'px-6 py-3 tracking-wider text-left font-medium rounded-br-md text-sm rounded-tr-md',
                  coin.gainLoss < 0 ? 'text-red2' : 'text-green2'
                )}
              >
                <i className="fas fa-sort-up"></i> {formatMoneyFromNumber(coin.gainLoss)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
