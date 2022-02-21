import { PlanType, PLAN_LIMITS, WatchListItem } from '@zachweinberg/obsidian-schema';
import type { NextPage } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import WatchlistIcon from '~/components/icons/WatchlistIcon';
import Layout from '~/components/layout/Layout';
import AddToWatchlistModal from '~/components/modals/AddToWatchlistModal';
import ConfirmModal from '~/components/modals/ConfirmModal';
import WatchListTable from '~/components/tables/WatchListTable';
import Button from '~/components/ui/Button';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';
import { useConfirm } from '~/hooks/useConfirm';
import { API } from '~/lib/api';

const WatchListContent: React.FunctionComponent = () => {
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [addingToWatchList, setAddingToWatchlist] = useState(false);
  const [watchListItems, setWatchListItems] = useState<WatchListItem[]>([]);
  const { confirmModalProps, openConfirm } = useConfirm();
  const auth = useAuth();

  const loadWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const watchlistData = await API.getWatchlist();
      setWatchListItems([...watchlistData.stocks, ...watchlistData.crypto]);
    } catch (err) {
      toast('Could not load your watchlist. Please contact us if this persists.');
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const onDeleteFromWatchlist = async (itemID: string) => {
    const confirm = await openConfirm({
      description: 'Remove this item from your watchlist?',
    });

    if (confirm) {
      await API.removeAssetFromWatchList(itemID);
      loadWatchlist();
    }
  };

  const onSave = (reload) => {
    if (reload) {
      loadWatchlist();
    }
    setAddingToWatchlist(false);
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const limitReached = useMemo(
    () =>
      auth.user?.plan?.type === PlanType.FREE &&
      watchListItems.length >= PLAN_LIMITS.watchlist.free,
    [watchListItems]
  );

  return (
    <Layout title="Watchlist | Obsidian Tracker">
      <ConfirmModal {...confirmModalProps} />
      <AddToWatchlistModal open={addingToWatchList} onClose={onSave} />

      <div className="flex items-center justify-between mb-7">
        <h1 className="font-bold text-dark text-[1.75rem]">Watchlist</h1>
      </div>

      <div
        className="flex flex-col mb-12 xl:grid xl:flex-row xl:justify-between"
        style={{ minWidth: '1000px' }}
      >
        <div className="flex-1 col-span-2 px-4 pt-4 mb-4 bg-white border rounded-md shadow-sm border-bordergray xl:mb-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[1rem]">Your Watchlist</p>
            {watchListItems.length > 0 && (
              <div className="w-24">
                <Button
                  type="button"
                  onClick={() => setAddingToWatchlist(true)}
                  className="w-24 py-3"
                  disabled={limitReached}
                >
                  + Add
                </Button>
              </div>
            )}
          </div>
          {loadingWatchlist ? (
            <div className="flex items-center justify-center my-24">
              <Spinner />
            </div>
          ) : watchListItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center my-24 text-center">
              <WatchlistIcon width={95} />
              <p className="font-bold text-[1.25rem] my-3">
                Keep track of your favorite assets.
              </p>
              <p className="font-medium text-[1rem] text-darkgray leading-tight mb-8">
                Your watchlist can help you track the prices of stocks and cryptocurrencies.
              </p>
              <div className="w-56">
                <Button type="button" onClick={() => setAddingToWatchlist(true)}>
                  + Add to watchlist
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <WatchListTable items={watchListItems} onDelete={onDeleteFromWatchlist} />
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
