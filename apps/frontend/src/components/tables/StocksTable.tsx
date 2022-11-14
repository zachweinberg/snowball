import { PlanType, PLAN_LIMITS, StockPosition, StockPositionWithQuote, Unit } from 'schema';
import { useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import { VerticalDots } from '../icons/VerticalDots';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import { BaseTable } from './BaseTable';
import { buildStockData, StocksTableData } from './builders';
import UpgradeBanner from './UpgradeBanner';

interface Props {
  stocks: StockPositionWithQuote[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (stockID: string, name: string) => void;
  onEdit: (position: StockPosition) => void;
  belongsTo: string;
}

const StocksTable: React.FunctionComponent<Props> = ({
  stocks,
  unit,
  onDelete,
  onAddAsset,
  onEdit,
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
          <>
            <ReactTooltip />

            <div style={{ maxWidth: '240px' }}>
              <p className="text-evergreen">{row.original.symbol}</p>
              <p
                data-tip={value}
                className="text-darkgray text-[0.875rem] truncate leading-tight"
              >
                {value}
              </p>
            </div>
          </>
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
        Header: 'Market Value',
        accessor: 'marketValue',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },

      {
        Header: 'Cost Basis',
        accessor: 'costPerShare',
        Cell: ({ row, value }) => (
          <>
            <ReactTooltip />

            <div
              className="underline"
              data-tip={`Cost per share: ${formatMoneyFromNumber(value)}`}
            >
              {formatMoneyFromNumber(value * row.original.quantity)}
            </div>
          </>
        ),
        sortType,
      },
      {
        Header: 'Gain / Loss',
        accessor: 'gainLoss',
        Cell: ({ row, value }) => {
          if (!auth.user) {
            return null;
          }
          return (
            <p className={value >= 0 ? 'text-green' : 'text-red'}>
              {unit === Unit.Dollars
                ? formatMoneyFromNumber(value)
                : formatPercentageChange(row.original.gainLossPercent)}
            </p>
          );
        },
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value, row }) => {
          if (auth.user?.id !== belongsTo) {
            return null;
          }

          return (
            <Menu
              options={[
                { label: 'Edit Stock', onClick: () => onEdit(row.original) },
                { label: 'Delete', onClick: () => onDelete(value, row.original.symbol) },
              ]}
              button={() => <VerticalDots />}
            />
          );
        },
      },
    ],
    [unit]
  );

  return (
    <>
      {stocks.length >= PLAN_LIMITS.stocks.free && auth.user?.plan?.type === PlanType.FREE && (
        <UpgradeBanner type="stock positions" />
      )}
      <BaseTable columns={columns} data={data} />
    </>
  );
};

export default StocksTable;
