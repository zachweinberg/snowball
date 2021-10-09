import { RealEstatePosition, Unit } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Dropdown from '~/components/ui/Dropdown';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildRealEstateData, RealEstateTableData } from './builders';

interface Props {
  realEstate: RealEstatePosition[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (realEstateID: string, name: string) => void;
}

const RealEstateTable: React.FunctionComponent<Props> = ({
  realEstate,
  onAddAsset,
  unit,
  onDelete,
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

  const data = useMemo<RealEstateTableData[]>(() => buildRealEstateData(realEstate), []);

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
    [unit]
  );

  return <BaseTable columns={columns} data={data} />;
};

export default RealEstateTable;
