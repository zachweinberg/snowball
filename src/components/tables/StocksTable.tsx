import { StockPositionWithQuote } from '@zachweinberg/wealth-schema';
import { useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import Dropdown from '../ui/Dropdown';

interface Props {
  stocks: StockPositionWithQuote[];
}

interface TableData {
  companyName: string;
  symbol: string;
  quantity: number;
  marketValue: number;
  dayChange: number;
  costBasis: number;
  gainLoss: number;
}

const buildData = (stocks: StockPositionWithQuote[]): TableData[] => {
  return stocks.map((stock) => ({
    companyName: stock.companyName,
    symbol: stock.symbol,
    quantity: stock.quantity,
    marketValue: stock.marketValue,
    dayChange: stock.dayChange,
    costBasis: stock.costBasis,
    gainLoss: stock.gainLoss,
  }));
};

const StocksTable: React.FunctionComponent<Props> = ({ stocks }: Props) => {
  const [units, setUnits] = useState<'dollars' | 'percents'>('dollars');

  const data = useMemo<TableData[]>(() => buildData(stocks), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'companyName',
        Cell: ({ row, value }) => (
          <div>
            <p className="mb-2">{value}</p>
            <p className="text-darkgray text-[0.875rem]">{row.original.symbol}</p>
          </div>
        ),
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
            {units === 'dollars'
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
            {units === 'dollars'
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
            options={[{ label: 'Delete', onClick: () => null }]}
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
    [units]
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

export default StocksTable;
