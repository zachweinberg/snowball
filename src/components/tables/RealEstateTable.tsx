import { RealEstatePosition, RealEstatePropertyType } from '@zachweinberg/wealth-schema';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import Dropdown from '~/components/ui/Dropdown';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';

interface Props {
  onAddAsset: () => void;
  realEstate: RealEstatePosition[];
}

interface TableData {
  address: string;
  propertyValue: number;
  propertyType: RealEstatePropertyType;
}

const buildData = (realEstate: RealEstatePosition[]): TableData[] => {
  return realEstate.map((realEstate) => ({
    address: realEstate.address ?? '-',
    propertyValue: realEstate.propertyValue,
    propertyType: realEstate.propertyType,
  }));
};

const RealEstateTable: React.FunctionComponent<Props> = ({
  realEstate,
  onAddAsset,
}: Props) => {
  if (realEstate.length === 0) {
    return (
      <div className="text-center mx-auto py-16">
        <p className="text-lg mb-3 font-semibold">Add some real estate to your portfolio:</p>
        <Button type="button" onClick={onAddAsset} className="w-64">
          + Add Real Estate
        </Button>
      </div>
    );
  }

  const data = useMemo<TableData[]>(() => buildData(realEstate), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Property Value',
        accessor: 'propertyValue',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: 'Property Type',
        accessor: 'propertyType',
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

export default RealEstateTable;
