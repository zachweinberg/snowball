import { CustomPosition, Unit } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCustomAssetData, CustomAssetTableData } from './builders';

interface Props {
  customs: CustomPosition[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (customAssetID: string, name: string) => void;
}

const CustomAssetTable: React.FunctionComponent<Props> = ({
  customs,
  unit,
  onAddAsset,
  onDelete,
}: Props) => {
  if (customs.length === 0) {
    return (
      <div className="py-16 mx-auto text-center">
        <p className="mb-3 text-lg font-semibold">Add a custom asset to your portfolio:</p>
        <Button type="button" onClick={onAddAsset} className="w-64">
          + Add Custom Asset
        </Button>
      </div>
    );
  }

  const data = useMemo<CustomAssetTableData[]>(() => buildCustomAssetData(customs), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'assetName',
      },
      {
        Header: 'Value',
        accessor: 'value',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: '',
        accessor: 'arrow',
        Cell: () => (
          <Menu
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

  return <BaseTable columns={columns} data={data} />;
};

export default CustomAssetTable;
