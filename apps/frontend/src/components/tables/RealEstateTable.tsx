import { Mortgage, PlanType, PLAN_LIMITS, RealEstatePosition } from 'schema';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { formatAddresstoString } from '~/lib/addresses';
import { formatMoneyFromNumber } from '~/lib/money';
import { VerticalDots } from '../icons/VerticalDots';
import Button from '../ui/Button';
import { BaseTable } from './BaseTable';
import { buildRealEstateData, RealEstateTableData } from './builders';
import UpgradeBanner from './UpgradeBanner';

interface Props {
  realEstate: RealEstatePosition[];
  onAddAsset: () => void;
  onDelete: (realEstateID: string, name: string) => void;
  onEdit: (position: RealEstatePosition) => void;
  belongsTo: string;
}

const calculateCurrentMortgageBalance = (
  monthlyPmt: number,
  monthsLeft: number,
  yearlyRate: number
): number => {
  const monthlyRate = yearlyRate / 100 / 12;
  return (monthlyPmt / monthlyRate) * (1 - Math.pow(1 / (1 + monthlyRate), monthsLeft));
};

const calculateEquity = (mortgage: Mortgage) => {
  const endOfMortgage = DateTime.fromMillis(mortgage.startDateMs).plus({
    years: mortgage.termYears,
  });

  const monthsLeft = Math.abs(DateTime.local().diff(endOfMortgage, 'months').months);

  const remaining = calculateCurrentMortgageBalance(
    mortgage.monthlyPayment,
    monthsLeft,
    mortgage.rate
  );

  return remaining;
};

const RealEstateTable: React.FunctionComponent<Props> = ({
  realEstate,
  onAddAsset,
  onDelete,
  belongsTo,
  onEdit,
}: Props) => {
  const auth = useAuth();

  if (realEstate.length === 0) {
    return (
      <div className="py-16 mx-auto text-center">
        {auth.user?.id === belongsTo ? (
          <>
            <p className="mb-3 text-lg font-semibold">
              Add some real estate to your portfolio:
            </p>
            <Button type="button" onClick={onAddAsset} className="w-64">
              + Add Real Estate
            </Button>
          </>
        ) : (
          <p className="mb-3 text-lg font-semibold">This portfolio has no real estate.</p>
        )}
      </div>
    );
  }

  const data = useMemo<RealEstateTableData[]>(() => buildRealEstateData(realEstate), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Property',
        accessor: 'address',
        Cell: ({ row }) =>
          row.original.address
            ? formatAddresstoString(row.original.address)
            : row.original.name ?? '-',
      },
      {
        Header: 'Property Value',
        accessor: 'propertyValue',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
      {
        Header: 'Mortgage',
        accessor: 'mortgage',
        Cell: ({ row }) => {
          if (row.original.mortgage) {
            return formatMoneyFromNumber(calculateEquity(row.original.mortgage));
          }

          return '-';
        },
      },
      {
        Header: 'Equity',
        accessor: 'equity',
        Cell: ({ value, row }) => {
          if (row.original.mortgage) {
            const mortgage = calculateEquity(row.original.mortgage);
            return formatMoneyFromNumber(row.original.propertyValue - mortgage);
          }

          return formatMoneyFromNumber(row.original.propertyValue);
        },
      },
      {
        Header: 'Property Type',
        accessor: 'propertyType',
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value, row }) => {
          if (auth.user?.id !== belongsTo) {
            return null;
          }

          const name = row.original.name
            ? row.original.name
            : row.original.address
            ? formatAddresstoString(row.original.address)
            : 'this property';

          return (
            <Menu
              options={[
                // { label: 'Edit Real Estate', onClick: () => onEdit(row.original) },
                { label: 'Delete', onClick: () => onDelete(value, name) },
              ]}
              button={() => <VerticalDots />}
            />
          );
        },
      },
    ],
    []
  );

  return (
    <>
      {realEstate.length >= PLAN_LIMITS.realEstate.free &&
        auth.user?.plan?.type === PlanType.FREE && <UpgradeBanner type="real estate" />}
      <BaseTable columns={columns} data={data} />
    </>
  );
};

export default RealEstateTable;
