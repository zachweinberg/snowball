import { CashPosition } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { formatMoneyFromNumber } from '~/lib/money';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildCashData, CashTableData } from './builders';

interface Props {
  cash: CashPosition[];
  onAddAsset: () => void;
  onDelete: (cashID: string) => void;
}

const CashTable: React.FunctionComponent<Props> = ({ cash, onAddAsset, onDelete }: Props) => {
  if (cash.length === 0) {
    return (
      <div className="py-16 mx-auto text-center">
        <p className="mb-3 text-lg font-semibold">Add some cash to your portfolio:</p>
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

export default CashTable;
