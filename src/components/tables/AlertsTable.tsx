import { Alert } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import { formatMoneyFromNumber } from '~/lib/money';
import { BaseTable } from './BaseTable';
import { AlertsTableData, buildAlertsData } from './builders';

interface Props {
  alerts: Alert[];
  onDelete: (alertID: string) => void;
}

const AlertsTable: React.FunctionComponent<Props> = ({ alerts, onDelete }: Props) => {
  if (alerts.length === 0) {
    return null;
  }

  const data = useMemo<AlertsTableData[]>(() => buildAlertsData(alerts), []);

  const columns = useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'symbol',
        Cell: ({ row, value }) => {
          return (
            <div style={{ maxWidth: '200px' }} className="flex items-center">
              {row.original.logoURL && (
                <img
                  src={row.original.logoURL}
                  alt={value}
                  className="w-8 h-8 mr-3 rounded-md"
                />
              )}

              <div className="w-full">
                <p className="mb-1 text-evergreen">{row.original.symbol}</p>
                <p className="text-darkgray text-[0.875rem] truncate leading-tight">{value}</p>
              </div>
            </div>
          );
        },
      },
      {
        Header: 'Condition',
        accessor: 'condition',
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: ({ value }) => formatMoneyFromNumber(value),
      },
    ],
    []
  );

  return <BaseTable columns={columns} data={data} />;
};

export default AlertsTable;
