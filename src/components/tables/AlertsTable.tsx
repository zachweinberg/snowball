import { Alert, AlertDestination, PLAN_LIMITS } from '@zachweinberg/obsidian-schema';
import { useMemo } from 'react';
import { formatMoneyFromNumber } from '~/lib/money';
import Menu from '../ui/Menu';
import { BaseTable } from './BaseTable';
import { AlertsTableData, buildAlertsData } from './builders';
import UpgradeBanner from './UpgradeBanner';

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
        Cell: ({ value, row }) => (
          <div className="flex items-center">
            <p className="ml-2 text-evergreen">{value}</p>
          </div>
        ),
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
      {
        Header: 'Destination',
        accessor: 'destinationValue',
        Cell: ({ value, row }) => (
          <div className="flex items-center">
            {row.original.destination === AlertDestination.Email ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M19 2c0-1.104-.896-2-2-2h-10c-1.104 0-2 .896-2 2v20c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2v-20zm-8.5 0h3c.276 0 .5.224.5.5s-.224.5-.5.5h-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5zm1.5 20c-.553 0-1-.448-1-1s.447-1 1-1c.552 0 .999.448.999 1s-.447 1-.999 1zm5-3h-10v-14.024h10v14.024z" />
              </svg>
            )}
            <p className="ml-2">{value}</p>
          </div>
        ),
      },
      {
        Header: '',
        accessor: 'id',
        disableSortBy: true,
        Cell: ({ value }) => (
          <Menu
            options={[{ label: 'Delete', onClick: () => onDelete(value) }]}
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

  return (
    <>
      {alerts.length >= PLAN_LIMITS.alerts.free && <UpgradeBanner type="alerts" />}
      <BaseTable columns={columns} data={data} />
    </>
  );
};

export default AlertsTable;
