import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useSortBy, useTable } from 'react-table';
import {
  AlertsTableData,
  CashTableData,
  CryptoTableData,
  CustomAssetTableData,
  RealEstateTableData,
  StocksTableData,
  WatchlistTableData,
} from './builders';

interface Props {
  columns: any;
  data:
    | StocksTableData[]
    | CryptoTableData[]
    | CashTableData[]
    | RealEstateTableData[]
    | CustomAssetTableData[]
    | WatchlistTableData[]
    | AlertsTableData[];
}

const SortUpIcon = () => <ChevronUpIcon className="w-3 h-3 ml-1 text-dark" />;
const SortDownIcon = () => <ChevronDownIcon className="w-3 h-3 ml-1 text-dark" />;

export const BaseTable: React.FunctionComponent<Props> = ({ columns, data }: Props) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  return (
    <div>
      <table {...getTableProps()} className="w-full text-left bg-white">
        <thead className="border-b border-bordergray">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="pb-2 text-sm font-semibold text-darkgray"
                >
                  <div className="flex items-center">
                    {column.render('Header')}
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <SortDownIcon />
                      ) : (
                        <SortUpIcon />
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="font-bold font-manrope">
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={classNames({ 'border-b border-bordergray': i !== rows.length - 1 })}
              >
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
