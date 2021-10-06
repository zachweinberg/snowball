import { CashPosition } from '@zachweinberg/wealth-schema';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import Dropdown from '~/components/ui/Dropdown';
import { formatMoneyFromNumber } from '~/lib/money';

interface Props {
  cash: CashPosition[];
}

interface TableData {
  accountName: string;
  value: number;
}

const buildData = (cash: CashPosition[]): TableData[] => {
  return cash.map((cash) => ({
    accountName: cash.accountName ?? 'Cash account',
    value: cash.amount,
  }));
};

const CashTable: React.FunctionComponent<Props> = ({ cash }: Props) => {
  if (cash.length === 0) {
    return <p>hi</p>;
  }

  const data = useMemo<TableData[]>(() => buildData(cash), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'accountName',
      },
      {
        Header: 'Cash Amount',
        accessor: 'value',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: '',
        accessor: 'arrow',
        Cell: () => (
          <Dropdown
            options={[
              { label: 'Edit', onClick: () => null },
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
    []
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

export default CashTable;
