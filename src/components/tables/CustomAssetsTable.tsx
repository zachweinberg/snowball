import { CustomPosition } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCustomAssetData, CustomAssetTableData } from './builders';

interface Props {
  customs: CustomPosition[];
  onAddAsset: () => void;
  onDelete: (customAssetID: string) => void;
  belongsTo: string;
}

const CustomAssetTable: React.FunctionComponent<Props> = ({
  customs,
  onAddAsset,
  onDelete,
  belongsTo,
}: Props) => {
  if (customs.length === 0) {
    const auth = useAuth();

    return (
      <div className="py-16 mx-auto text-center">
        {auth.user?.id === belongsTo ? (
          <>
            <p className="mb-3 text-lg font-semibold">Add a custom asset to your portfolio:</p>
            <Button type="button" onClick={onAddAsset} className="w-64">
              + Add Custom Asset
            </Button>
          </>
        ) : (
          <p className="mb-3 text-lg font-semibold">This portfolio has no custom assets.</p>
        )}
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
        accessor: 'id',
        disableSortBy: true,
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

export default CustomAssetTable;
