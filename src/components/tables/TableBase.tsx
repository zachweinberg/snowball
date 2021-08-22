import classNames from 'classnames';
import StockRow from './StockRow';

const headers = ['Ticker', 'Quantity', 'Last', 'Market Value', 'Day Change', 'Cost Basis', 'Gain/Loss'];

const stocks = [
  {
    symbol: 'AMC',
    fullName: 'AMC Entertainment Holdings asdfasdfInc.',
    quantity: 42,
    last: 294.12,
    marketValue: 912.42,
    dayChange: -12,
    costBasis: 9872.13,
    gainLoss: -4,
  },
  {
    symbol: 'GME',
    fullName: 'Gamestop',
    quantity: 42,
    last: 294.12,
    marketValue: 912.42,
    dayChange: -12,
    costBasis: 3.13,
    gainLoss: -4,
  },
];

const TableBase: React.FunctionComponent = () => {
  return (
    <div className="min-w-full">
      <table className="min-w-full">
        <tr className="text-xs bg-white shadow-sm">
          {headers.map((header, i) => (
            <th
              key={i}
              className={classNames(`px-6 py-4 font-medium tracking-wider text-left uppercase text-purple2`, {
                'rounded-bl-md rounded-tl-md': i === 0,
                'rounded-br-md rounded-tr-md': i === headers.length - 1,
              })}
            >
              {header}
            </th>
          ))}
        </tr>
        {stocks.map((stock, i) => (
          <StockRow stock={stock} key={i} />
        ))}
      </table>
    </div>
  );
};

export default TableBase;
