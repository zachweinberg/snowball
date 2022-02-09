import { CustomPosition, PlanType, PLAN_LIMITS } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber } from '~/lib/money';
import { VerticalDots } from '../icons/VerticalDots';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCustomAssetData, CustomAssetTableData } from './builders';
import UpgradeBanner from './UpgradeBanner';

interface Props {
  customs: CustomPosition[];
  onAddAsset: () => void;
  onDelete: (customAssetID: string) => void;
  belongsTo: string;
  onEdit: (position: CustomPosition) => void;
}

const CustomAssetTable: React.FunctionComponent<Props> = ({
  customs,
  onAddAsset,
  onDelete,
  belongsTo,
  onEdit,
}: Props) => {
  const auth = useAuth();

  if (customs.length === 0) {
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
        Header: 'Added On',
        accessor: 'createdAt',
        Cell: ({ value }) => `${new Date(value).toLocaleDateString()}`,
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <Menu
            options={[
              { label: 'Edit Custom Asset', onClick: () => onEdit(row.original) },
              { label: 'Delete', onClick: () => onDelete(value) },
            ]}
            button={() => <VerticalDots />}
          />
        ),
      },
    ],
    []
  );

  return (
    <>
      {customs.length >= PLAN_LIMITS.custom.free &&
        auth.user?.plan?.type === PlanType.FREE && <UpgradeBanner type="custom assets" />}
      <BaseTable columns={columns} data={data} />
    </>
  );
};

export default CustomAssetTable;
