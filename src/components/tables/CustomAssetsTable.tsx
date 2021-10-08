import { CustomPosition, Unit } from '@zachweinberg/wealth-schema';
import { useMemo } from 'react';
import Dropdown from '~/components/ui/Dropdown';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCustomAssetData, CustomAssetTableData } from './builders';

interface Props {
  custom: CustomPosition[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (customID: string, name: string) => void;
}

const CustomAssetsTable: React.FunctionComponent<Props> = ({
  custom,
  onAddAsset,
  unit,
  onDelete,
}: Props) => {
  console.log(custom);
  if (custom.length === 0) {
    return (
      <div className="text-center mx-auto py-16">
        <p className="text-lg mb-3 font-semibold">Add some custom assets to your portfolio:</p>
        <Button type="button" onClick={onAddAsset} className="w-64">
          + Add Custom Asset
        </Button>
      </div>
    );
  }

  const data = useMemo<CustomAssetTableData[]>(() => buildCustomAssetData(custom), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Property Value',
        accessor: 'propertyValue',
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
    [unit]
  );

  return <BaseTable columns={columns} data={data} />;
};

export default CustomAssetsTable;
