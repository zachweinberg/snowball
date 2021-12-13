import { Alert } from '@zachweinberg/obsidian-schema';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import AlertsTable from '~/components/tables/AlertsTable';
import Button from '~/components/ui/Button';
import Spinner from '~/components/ui/Spinner';
import AddAlertModal from '~/components/watchlist/AddAlertModal';
import { API } from '~/lib/api';

const BellIcon = () => (
  <svg
    className="w-32 mb-8 fill-current"
    viewBox="0 0 150 150"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="75" cy="75" r="75" fill="#F9FAFF" />
    <path
      d="M74.7441 48.6133C75.8767 48.6133 76.7949 47.6951 76.7949 46.5625V42.0508C76.7949 40.9182 75.8767 40 74.7441 40C73.6116 40 72.6934 40.9182 72.6934 42.0508V46.5625C72.6934 47.6951 73.6116 48.6133 74.7441 48.6133Z"
      fill="#00565B"
    />
    <path
      d="M60.7327 49.3494L64.1888 52.2494C65.062 52.9821 66.3545 52.8586 67.0779 51.9966C67.8059 51.129 67.6929 49.8355 66.8251 49.1075L63.369 46.2074C62.5011 45.4793 61.2078 45.5926 60.4799 46.4602C59.7518 47.3277 59.8649 48.6213 60.7327 49.3494Z"
      fill="#00565B"
    />
    <path
      d="M85.2997 52.2494L88.7558 49.3493C89.6235 48.6213 89.7366 47.3276 89.0086 46.4602C88.2807 45.5925 86.9869 45.4793 86.1194 46.2074L82.6633 49.1074C81.7956 49.8355 81.6825 51.1291 82.4105 51.9966C83.1364 52.8616 84.4296 52.9795 85.2997 52.2494Z"
      fill="#00565B"
    />
    <path
      d="M75.4988 102.222C76.5892 102.222 77.6348 101.789 78.4058 101.018C79.1768 100.247 79.61 99.2017 79.61 98.1113H71.3877C71.3877 99.2017 71.8208 100.247 72.5918 101.018C73.3628 101.789 74.4085 102.222 75.4988 102.222Z"
      fill="#141414"
    />
    <path
      d="M93.8435 92.7319C93.9992 92.3562 94.0398 91.9428 93.9604 91.544C93.881 91.1451 93.6851 90.7788 93.3975 90.4913L89.8886 86.9825V75.5001C89.8846 72.043 88.636 68.7028 86.3712 66.0908C84.1064 63.4788 80.9769 61.7695 77.5552 61.2756V59.0556C77.5552 58.5104 77.3387 57.9876 76.9532 57.6021C76.5677 57.2166 76.0448 57 75.4997 57C74.9545 57 74.4317 57.2166 74.0462 57.6021C73.6607 57.9876 73.4441 58.5104 73.4441 59.0556V61.2756C70.0224 61.7695 66.8929 63.4788 64.6281 66.0908C62.3634 68.7028 61.1147 72.043 61.1107 75.5001V86.9825L57.6018 90.4913C57.3145 90.7788 57.1188 91.145 57.0395 91.5437C56.9602 91.9424 57.0009 92.3557 57.1564 92.7312C57.312 93.1068 57.5754 93.4278 57.9133 93.6536C58.2513 93.8795 58.6486 94.0001 59.0551 94.0002H91.9442C92.3507 94.0003 92.7481 93.8799 93.0862 93.6541C93.4243 93.4284 93.6878 93.1074 93.8435 92.7319ZM64.0173 89.8891L64.6195 89.2868C65.0051 88.9014 65.2217 88.3786 65.2218 87.8335V75.5001C65.2218 72.7742 66.3047 70.16 68.2321 68.2326C70.1596 66.3051 72.7738 65.2223 75.4997 65.2223C78.2255 65.2223 80.8397 66.3051 82.7672 68.2326C84.6947 70.16 85.7775 72.7742 85.7775 75.5001V87.8335C85.7776 88.3786 85.9943 88.9014 86.3798 89.2868L86.9821 89.8891H64.0173Z"
      fill="#141414"
    />
  </svg>
);

const WatchListContent: React.FunctionComponent = () => {
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const [addingAlert, setAddingAlert] = useState(false);

  const [alerts, setAlerts] = useState<Alert[]>([]);

  const loadAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const alertsData = await API.getAlerts();
      setAlerts(alertsData.alerts);
    } catch (err) {
      alert('Could not load your alerts. Please contact us if this persists.');
    } finally {
      setLoadingAlerts(false);
    }
  };

  const onDeleteFromAlerts = async (alertID: string) => {
    if (window.confirm('Are you sure you want to remove this alert?')) {
      await API.removeAlert(alertID);
      loadAlerts();
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <Layout title="Alerts - Obsidian Tracker">
      <AddAlertModal
        open={addingAlert}
        onClose={(reload) => {
          setAddingAlert(false);
          if (reload) {
            loadAlerts();
          }
        }}
      />

      <div className="flex items-center justify-between mb-7">
        <h1 className="font-bold text-dark text-[1.75rem]">Alerts</h1>
      </div>

      <div className="flex flex-col mb-12 xl:grid xl:flex-row xl:justify-between">
        <div className="flex-1 col-span-2 px-4 pt-4 mb-4 bg-white border shadow-sm rounded-2xl border-bordergray xl:mb-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[1rem]">Alerts</p>
            {alerts.length > 0 && (
              <div className="w-24">
                <Button
                  type="button"
                  onClick={() => setAddingAlert(true)}
                  className="w-24 py-3"
                >
                  + Add
                </Button>
              </div>
            )}
          </div>
          {loadingAlerts ? (
            <div className="flex items-center justify-center my-24">
              <Spinner size={30} />
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-24 text-center">
              <BellIcon />
              <p className="font-bold text-[1.25rem] mb-3">Get notified.</p>
              <p className="font-medium text-[1rem] text-darkgray leading-tight mb-8">
                Alerts will notify you when an asset hits a certain price.
              </p>
              <div className="w-56">
                <Button type="button" onClick={() => setAddingAlert(true)}>
                  + Add alert
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <AlertsTable alerts={alerts} onDelete={onDeleteFromAlerts} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const WatchlistPage: NextPage = () => {
  return (
    <RequiredLoggedIn>
      <WatchListContent />
    </RequiredLoggedIn>
  );
};

export default WatchlistPage;
