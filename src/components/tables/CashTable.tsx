import { CashPosition } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { formatMoneyFromNumber } from '~/lib/money';
import { VerticalDots } from '../icons/VerticalDots';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCashData, CashTableData } from './builders';

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
      },
      {
        Header: 'Cash Amount',
        accessor: 'value',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value, row }) => (
          <Menu
            options={[
              { label: 'Edit Cash', onClick: () => onEdit(row.original) },
              { label: 'Delete', onClick: () => onDelete(value) },
            ]}
            button={() => <VerticalDots />}
          />
        ),
      },
    ],
    []
  );

  return <BaseTable columns={columns} data={data} />;
};

export default CashTable;
