import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Alert, PlanType, PLAN_LIMITS } from 'schema';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import BellIcon from '~/components/icons/BellIcon';
import Layout from '~/components/layout/Layout';
import AddAlertModal from '~/components/modals/AddAlertModal';
import ConfirmModal from '~/components/modals/ConfirmModal';
import AlertsTable from '~/components/tables/AlertsTable';
import Button from '~/components/ui/Button';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';
import { useConfirm } from '~/hooks/useConfirm';
import { API } from '~/lib/api';

const AlertsContent: React.FunctionComponent = () => {
  const [loadingAlerts, setLoadingAlerts] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [addingAlert, setAddingAlert] = useState(false);
  const { confirmModalProps, openConfirm } = useConfirm();
  const auth = useAuth();

  const loadAlerts = async () => {
    setLoadingAlerts(true);
    try {
      const alertsData = await API.getAlerts();
      setAlerts(alertsData.alerts);
    } catch (err) {
      toast('Could not load your alerts. Please contact us if this persists.');
    } finally {
      setLoadingAlerts(false);
    }
  };

  const onDeleteFromAlerts = async (alertID: string) => {
    const confirm = await openConfirm({
      description: 'Are you sure you want to delete this alert?',
    });

    if (confirm) {
      await API.removeAlert(alertID);
      loadAlerts();
    }
  };

  const onSave = (reload) => {
    if (reload) {
      loadAlerts();
    }
    setAddingAlert(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const limitReached = useMemo(
    () => auth.user?.plan?.type === PlanType.FREE && alerts.length >= PLAN_LIMITS.alerts.free,
    [alerts, auth.user]
  );

  return (
    <Layout title="Alerts | Snowball">
      <ConfirmModal {...confirmModalProps} />
      <AddAlertModal open={addingAlert} onClose={onSave} />

      <div className="flex items-center justify-between mb-7">
        <h1 className="font-bold text-dark text-[1.75rem]">Alerts</h1>
      </div>

      <div
        className="flex flex-col mb-12 xl:grid xl:flex-row xl:justify-between"
        style={{ minWidth: '1000px' }}
      >
        <div className="flex-1 col-span-2 px-4 pt-4 mb-4 bg-white border rounded-md shadow-sm border-bordergray xl:mb-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[1rem]">Your Alerts</p>
            {alerts.length > 0 && (
              <div className="w-24">
                <Button
                  type="button"
                  onClick={() => setAddingAlert(true)}
                  className="w-24 py-3"
                  disabled={limitReached}
                >
                  + Add
                </Button>
              </div>
            )}
          </div>
          {loadingAlerts ? (
            <div className="flex items-center justify-center my-24">
              <Spinner />
            </div>
          ) : alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-24 text-center">
              <BellIcon width={95} />
              <p className="font-bold text-[1.25rem] my-3">Get notified.</p>
              <p className="font-medium text-[1rem] text-darkgray leading-tight mb-8">
                Alerts will notify you when an asset hits a certain price.
              </p>
              <div className="w-56">
                <Button type="button" onClick={() => setAddingAlert(true)}>
                  + Add Alert
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

const AlertsPage: NextPage = () => {
  return (
    <RequiredLoggedIn>
      <AlertsContent />
    </RequiredLoggedIn>
  );
};

export default AlertsPage;
