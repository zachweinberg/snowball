import { StockPositionWithQuote, Unit } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import { BaseTable } from './BaseTable';
import { buildStockData, StocksTableData } from './builders';

interface Props {
  stocks: StockPositionWithQuote[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (stockID: string, name: string) => void;
  belongsTo: string;
}

const StocksTable: React.FunctionComponent<Props> = ({
  stocks,
  unit,
  onDelete,
  onAddAsset,
  belongsTo,
}: Props) => {
  const auth = useAuth();

  if (stocks.length === 0) {
    return (
      <div className="py-16 mx-auto text-center">
        {auth.user?.id === belongsTo ? (
          <>
            <p className="mb-3 text-lg font-semibold">Add some stocks to your portfolio:</p>
            <Button type="button" onClick={onAddAsset} className="w-64">
              + Add Stock
            </Button>
          </>
        ) : (
          <p className="mb-3 text-lg font-semibold">This portfolio has no stocks.</p>
        )}
      </div>
    );
  }

  const data = useMemo<StocksTableData[]>(() => buildStockData(stocks), []);

  const sortType = useMemo(
    () => (rowA, rowB) =>
      rowA.original.quantity * rowA.original.costPerShare -
      rowB.original.quantity * rowB.original.costPerShare,
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'companyName',
        Cell: ({ row, value }) => (
          <div style={{ maxWidth: '240px' }}>
            <p className="text-evergreen">{row.original.symbol}</p>
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
        Cell: ({ value }) => formatMoneyFromNumber(value),
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
        sortType,
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
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <Menu
            options={[
              { label: 'Edit Cost Basis', onClick: () => null },
              { label: 'Edit Quantity', onClick: () => null },
              { label: 'Delete', onClick: () => onDelete(value, row.original.symbol) },
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

  return <BaseTable columns={columns} data={data} />;
};

export default StocksTable;
