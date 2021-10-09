import { CashPosition, Unit } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Dropdown from '~/components/ui/Dropdown';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCashData, CashTableData } from './builders';

interface Props {
  cash: CashPosition[];
  unit: Unit;
  onAddAsset: () => void;
  onDelete: (cashID: string, name: string) => void;
}

const CashTable: React.FunctionComponent<Props> = ({
  cash,
  unit,
  onAddAsset,
  onDelete,
}: Props) => {
  if (cash.length === 0) {
    return (
      <div className="text-center mx-auto py-16">
        <p className="text-lg mb-3 font-semibold">Add some cash to your portfolio:</p>
        <Button type="button" onClick={onAddAsset} className="w-64">
          + Add Cash
        </Button>
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

  return <BaseTable columns={columns} data={data} />;
};

export default CashTable;
