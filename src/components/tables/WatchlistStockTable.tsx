import { WatchListItem } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';
import { BaseTable } from './BaseTable';
import { buildWatchlistData, WatchlistTableData } from './builders';

interface Props {
  items: WatchListItem[];
}

const WatchListTable: React.FunctionComponent<Props> = ({ items }: Props) => {
  if (items.length === 0) {
    return null;
  }

  const data = useMemo<WatchlistTableData[]>(() => buildWatchlistData(items), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'fullName',
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
        Header: 'Price',
        accessor: 'last',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: 'Day Change (%)',
        accessor: 'changePercent',
        Cell: ({ value }) => (
          <p className={value >= 0 ? 'text-green' : 'text-red'}>
            {formatPercentageChange(value)}
          </p>
        ),
      },
      {
        Header: 'Day Change ($)',
        accessor: 'changeDollars',
        Cell: ({ value }) => (
          <p className={value >= 0 ? 'text-green' : 'text-red'}>
            {formatMoneyFromNumber(value)}
          </p>
        ),
      },
      {
        Header: 'Market Cap',
        accessor: 'marketCap',
        Cell: ({ value }) =>
          value > 0 ? formatMoneyFromNumber(value, true).replace('~', '') : '-',
      },
      {
        Header: '',
        accessor: 'id',
        Cell: ({ value }) => (
          <Menu
            options={[
              { label: 'Edit', onClick: () => null },
              { label: 'Delete', onClick: () => onDelete(value) },
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
    []
  );

  return <BaseTable columns={columns} data={data} />;
};

export default WatchListTable;
