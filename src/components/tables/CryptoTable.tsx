import { CryptoPositionWithQuote, Unit } from '@zachweinberg/wealth-schema';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import Dropdown from '../ui/Dropdown';
interface Props {
  crypto: CryptoPositionWithQuote[];
  unit: Unit;
}

interface TableData {
  coinName: string;
  symbol: string;
  quantity: number;
  marketValue: number;
  dayChange: number;
  costBasis: number;
  gainLoss: number;
}

const buildData = (crypto: CryptoPositionWithQuote[]): TableData[] => {
  return crypto.map((crypto) => ({
    coinName: crypto.coinName,
    symbol: crypto.symbol,
    quantity: crypto.quantity,
    marketValue: crypto.marketValue,
    dayChange: crypto.dayChange,
    costBasis: crypto.costBasis,
    gainLoss: crypto.gainLoss,
    logoURL: crypto.logoURL,
  }));
};

const CryptoTable: React.FunctionComponent<Props> = ({ crypto, unit }: Props) => {
  const data = useMemo<TableData[]>(() => buildData(crypto), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'coinName',
        Cell: ({ row, value }) => {
          return (
            <div style={{ maxWidth: '200px' }} className="flex items-center">
              {row.original.logoURL && (
                <img
                  src={row.original.logoURL}
                  alt={value}
                  className="h-8 w-8 mr-3 rounded-lg"
                />
              )}

              <div>
                <p className="mb-2 text-evergreen">{row.original.symbol}</p>
                <p className="text-darkgray text-[0.875rem] truncate leading-tight">{value}</p>
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Market Value',
        accessor: 'marketValue',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: 'Day Change',
        accessor: 'dayChange',
        Cell: ({ value }) => (
          <p className={value >= 0 ? 'text-green' : 'text-red'}>
            {unit === Unit.Dollars
              ? formatMoneyFromNumber(value)
              : formatPercentageChange(value)}
          </p>
        ),
      },
      {
        Header: 'Cost Basis',
        accessor: 'costBasis',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: 'Gain / Loss',
        accessor: 'gainLoss',
        Cell: ({ value }) => (
          <p className={value >= 0 ? 'text-green' : 'text-red'}>
            {unit === Unit.Dollars
              ? formatMoneyFromNumber(value)
              : formatPercentageChange(value)}
          </p>
        ),
      },
      {
        Header: '',
        accessor: 'arrow',
        Cell: () => (
          <Dropdown
            options={[
              { label: 'Edit Cost Basis', onClick: () => null },
              { label: 'Edit Quantity', onClick: () => null },
              { label: 'Delete', onClick: () => null },
            ]}
            button={() => (
              <svg
                viewBox="0 0 4 20"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 cursor-pointer fill-current text-darkgray"
              >
                <circle cx="2" cy="18" r="2" fill="#757784" />
                <circle cx="2" cy="10" r="2" fill="#757784" />
                <circle cx="2" cy="2" r="2" fill="#757784" />
              </svg>
            )}
          />
        ),
      },
    ],
    [unit]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  return (
    <div>
      <table {...getTableProps()} className="w-full text-left bg-white">
        <thead className="border-b border-bordergray">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className="pb-2 font-semibold text-darkgray">
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="font-bold font-manrope">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-b border-bordergray">
                {row.cells.map((cell) => {
                  return (
                    <td className="py-3" {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
