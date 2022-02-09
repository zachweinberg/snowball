import { LinkIcon } from '@heroicons/react/outline';
import { CashPosition, PlanType, PLAN_LIMITS } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import ReactTooltip from 'react-tooltip';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber } from '~/lib/money';
import { VerticalDots } from '../icons/VerticalDots';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCashData, CashTableData } from './builders';
import UpgradeBanner from './UpgradeBanner';

interface Props {
  cash: CashPosition[];
  onAddAsset: () => void;
  onDelete: (cashID: string) => void;
  onEdit: (position: CashPosition) => void;
  belongsTo: string;
}

const CashTable: React.FunctionComponent<Props> = ({
  cash,
  onAddAsset,
  onEdit,
  onDelete,
  belongsTo,
}: Props) => {
  const auth = useAuth();

  if (cash.length === 0) {
    return (
      <div className="py-16 mx-auto text-center">
        {auth.user?.id === belongsTo ? (
          <>
            <p className="mb-3 text-lg font-semibold">Add some cash to your portfolio:</p>
            <Button type="button" onClick={onAddAsset} className="w-64">
              + Add Cash
            </Button>
          </>
        ) : (
          <p className="mb-3 text-lg font-semibold">This portfolio has no cash.</p>
        )}
      </div>
    );
  }

  const data = useMemo<CashTableData[]>(() => buildCashData(cash), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Account',
        accessor: 'accountName',
        Cell: ({ value, row }) => (
          <div className="flex items-center">
            {value}{' '}
            {auth.user && row.original.isPlaid && (
              <LinkIcon
                data-tip={`This account is linked to your bank via Plaid.<br/>We will update the cash amount six times per day.`}
                className="w-4 h-4 ml-4"
              />
            )}
          </div>
        ),
      },
      {
        Header: 'Cash Amount',
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
        Cell: ({ value, row }) => {
          const isPlaid = row.original.isPlaid;

          const options = [
            {
              label: `${isPlaid ? 'Unlink Account' : 'Delete'}`,
              onClick: () => onDelete(value),
            },
          ];

          if (!isPlaid) {
            options.unshift({ label: 'Edit Cash', onClick: () => onEdit(row.original) });
          }
          return <Menu options={options} button={() => <VerticalDots />} />;
        },
      },
    ],
    []
  );

  return (
    <>
      <ReactTooltip multiline />
      {cash.length >= PLAN_LIMITS.cash.free && auth.user?.plan?.type === PlanType.FREE && (
        <UpgradeBanner type="cash holdings" />
      )}
      <BaseTable columns={columns} data={data} />
    </>
  );
};

export default CashTable;
