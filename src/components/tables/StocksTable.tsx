import { StockPositionWithQuote, Unit } from '@zachweinberg/wealth-schema';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import { formatMoneyFromNumber, formatNumber, formatPercentageChange } from '~/lib/money';
import Button from '../ui/Button';
import Dropdown from '../ui/Dropdown';

interface Props {
  stocks: StockPositionWithQuote[];
  unit: Unit;
  onAddAsset: () => void;
}

interface TableData {
  companyName: string;
  symbol: string;
  quantity: number;
  marketValue: number;
  dayChange: number;
  costPerShare: number;
  gainLoss: number;
  last: number;
}

const buildData = (stocks: StockPositionWithQuote[]): TableData[] => {
  return stocks.map((stock) => ({
    companyName: stock.companyName,
    symbol: stock.symbol,
    quantity: stock.quantity,
    marketValue: stock.marketValue,
    dayChange: stock.dayChange,
    dayChangePercent: stock.dayChangePercent,
    costPerShare: stock.costPerShare,
    gainLoss: stock.gainLoss,
    last: stock.last,
    gainLossPercent: stock.gainLossPercent,
  }));
};

const StocksTable: React.FunctionComponent<Props> = ({ stocks, unit, onAddAsset }: Props) => {
  if (stocks.length === 0) {
    return (
      <div className="text-center mx-auto py-16">
        <p className="text-lg mb-3 font-semibold">Add some stocks to your portfolio:</p>
        <Button type="button" onClick={onAddAsset} className="w-64">
          + Add Stock
        </Button>
      </div>
    );
  }

  const data = useMemo<TableData[]>(() => buildData(stocks), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'companyName',
        Cell: ({ row, value }) => (
          <div style={{ maxWidth: '240px' }}>
            <p className="mb-1 text-evergreen">{row.original.symbol}</p>
            <p className="text-darkgray text-[0.875rem] truncate leading-tight">{value}</p>
          </div>
        ),
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },
      {
        Header: 'Last',
        accessor: 'last',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Market Value',
        accessor: 'marketValue',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: 'Day Change',
        accessor: 'dayChange',
        Cell: ({ row, value }) => (
          <p className={value >= 0 ? 'text-green' : 'text-red'}>
            {unit === Unit.Dollars
              ? formatMoneyFromNumber(value)
              : formatPercentageChange(row.original.dayChangePercent)}
          </p>
        ),
      },
      {
        Header: 'Cost Basis',
        accessor: 'costPerShare',
        Cell: ({ row, value }) => formatMoneyFromNumber(value * row.original.quantity),
      },
      {
        Header: 'Gain / Loss',
        accessor: 'gainLoss',
        Cell: ({ row, value }) => (
          <p className={value >= 0 ? 'text-green' : 'text-red'}>
            {unit === Unit.Dollars
              ? formatMoneyFromNumber(value)
              : formatPercentageChange(row.original.gainLossPercent)}
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
                <th
                  {...column.getHeaderProps()}
                  className="pb-2 text-sm font-semibold text-darkgray"
                >
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
                    <td className="py-3 text-sm" {...cell.getCellProps()}>
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
