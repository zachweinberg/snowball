import { CryptoPositionWithQuote, Unit } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber, formatNumber, formatPercentageChange } from '~/lib/money';
import Button from '../ui/Button';
import Menu from '../ui/Menu';
import { BaseTable } from './BaseTable';
import { buildCryptoData, CryptoTableData } from './builders';

interface Props {
  crypto: CryptoPositionWithQuote[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (cryptoID: string, name: string) => void;
  belongsTo: string;
}

const CryptoTable: React.FunctionComponent<Props> = ({
  crypto,
  unit,
  onDelete,
  onAddAsset,
  belongsTo,
}: Props) => {
  const auth = useAuth();

  if (crypto.length === 0) {
    return (
      <div className="py-16 mx-auto text-center">
        {auth.user?.id === belongsTo ? (
          <>
            <p className="mb-3 text-lg font-semibold">Add some crypto to your portfolio:</p>
            <Button type="button" onClick={onAddAsset} className="w-64">
              + Add Crypto
            </Button>
          </>
        ) : (
          <p className="mb-3 text-lg font-semibold">This portfolio has no crypto.</p>
        )}
      </div>
    );
  }

  const data = useMemo<CryptoTableData[]>(() => buildCryptoData(crypto), []);

  const sortType = useMemo(
    () => (rowA, rowB) =>
      rowA.original.quantity * rowA.original.costPerCoin -
      rowB.original.quantity * rowB.original.costPerCoin,
    []
  );

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
                  className="w-8 h-8 mr-3 rounded-md"
                />
              )}

              <div className="w-full">
                <p className="mb-1 text-evergreen">{row.original.symbol}</p>
                <p className="text-darkgray text-[0.875rem] truncate leading-tight">{value}</p>
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
        Cell: ({ value }) => formatNumber(value),
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
        accessor: 'costPerCoin',
        Cell: ({ row, value }) => (
          <>
            <ReactTooltip />

            <div data-tip={`Cost per coin: ${formatMoneyFromNumber(value)}`}>
              {formatMoneyFromNumber(value * row.original.quantity)}
            </div>
          </>
        ),
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
        Cell: ({ row, value }) => (
          <Menu
            options={[
              { label: 'Edit Cost Basis', onClick: () => null },
              { label: 'Edit Quantity', onClick: () => null },
              { label: 'Delete', onClick: () => onDelete(value, row.original.symbol) },
            ]}
            button={() => (
              <div className="w-10 cursor-pointer">
                <svg
                  viewBox="0 0 4 20"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 fill-current text-darkgray"
                >
                  <circle cx="2" cy="18" r="2" fill="#757784" />
                  <circle cx="2" cy="10" r="2" fill="#757784" />
                  <circle cx="2" cy="2" r="2" fill="#757784" />
                </svg>
              </div>
            )}
          />
        ),
      },
    ],
    [unit]
  );

  return <BaseTable columns={columns} data={data} />;
};

export default CryptoTable;
