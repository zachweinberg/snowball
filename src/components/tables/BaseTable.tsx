import { useTable } from 'react-table';
import {
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
    | WatchlistTableData[];
}

export const BaseTable: React.FunctionComponent<Props> = ({ columns, data }: Props) => {
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
