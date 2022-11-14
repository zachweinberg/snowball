import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import {
  AssetColor,
  AssetType,
  CashPosition,
  CryptoPosition,
  CustomPosition,
  PortfolioWithQuotes,
  RealEstatePosition,
  StockPosition,
  Unit,
} from 'schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import AddAssetForm from '~/components/add-assets/AddAssetForm';
import BalanceOverTime from '~/components/charts/BalanceOverTime';
import Layout from '~/components/layout/Layout';
import ConfirmModal from '~/components/modals/ConfirmModal';
import EditCashModal from '~/components/modals/EditCashModal';
import EditCryptoModal from '~/components/modals/EditCryptoModal';
import EditCustomModal from '~/components/modals/EditCustomModal';
import EditRealEstateModal from '~/components/modals/EditRealEstateModal';
import EditStockModal from '~/components/modals/EditStockModal';
import AssetPercentCard from '~/components/portfolio-view/AssetPercentCard';
import CashTable from '~/components/tables/CashTable';
import CryptoTable from '~/components/tables/CryptoTable';
import CustomAssetsTable from '~/components/tables/CustomAssetsTable';
import RealEstateTable from '~/components/tables/RealEstateTable';
import StocksTable from '~/components/tables/StocksTable';
import Button from '~/components/ui/Button';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Link from '~/components/ui/Link';
import Select from '~/components/ui/Select';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';
import { useConfirm } from '~/hooks/useConfirm';
import { API } from '~/lib/api';

type PositionType =
  | StockPosition
  | CryptoPosition
  | RealEstatePosition
  | CashPosition
  | CustomPosition;

const MIN_WIDTH = '1100px';

const PortfolioView: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingAsset, setAddingAsset] = useState(false);
  const [defaultAssetTypeToAdd, setDefaultAssetTypeToAdd] = useState<AssetType | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioWithQuotes | null>(null);
  const [activeTab, setActiveTab] = useState<AssetType>(AssetType.Stock);
  const [unit, setUnit] = useState<Unit>(Unit.Dollars);
  const [error, setError] = useState('');
  const { confirmModalProps, openConfirm } = useConfirm();

  const [editPosition, setEditPosition] = useState<PositionType | null>(null);

  const loadPortfolioData = async (firstMount?: boolean) => {
    setLoading(true);

    try {
      const portfolioData = await API.getPortfolio(router.query.portfolioID as string);

      setPortfolio(portfolioData.portfolio);

      if (firstMount && portfolioData.portfolio.settings.defaultAssetType) {
        setActiveTab(portfolioData.portfolio.settings.defaultAssetType);
      }
    } catch (err) {
      if (err.response.status === 404) {
        setError("Sorry, we couldn't find that portfolio.");
      } else {
        setError(
          'Something went wrong while loading this portfolio. Please contact support if this persists.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolioData(true);
  }, []);

  const portfolioTotal = useMemo(
    () =>
      (portfolio?.cashTotal ?? 0) +
      (portfolio?.cryptoTotal ?? 0) +
      (portfolio?.stocksTotal ?? 0) +
      (portfolio?.customsTotal ?? 0) +
      (portfolio?.realEstateTotal ?? 0),
    [portfolio]
  );

  const onDeletePosition = async (positionID: string, name: string, assetType: AssetType) => {
    const confirm = await openConfirm({
      description: `Are you sure you want to delete ${name} from this portfolio?`,
    });

    if (confirm && portfolio) {
      setLoading(true);
      await API.deleteAssetFromPortfolio(positionID, assetType, portfolio.id);
      loadPortfolioData();
    }
  };

  const renderTable = useMemo(() => {
    if (!portfolio) {
      return null;
    }

    switch (activeTab) {
      case AssetType.Stock:
        return (
          <StocksTable
            belongsTo={portfolio.userID}
            stocks={portfolio.stocks}
            unit={unit}
            onAddAsset={() => setDefaultAssetTypeToAdd(AssetType.Stock)}
            onEdit={(position) => setEditPosition(position)}
            onDelete={(stockID, name) => {
              onDeletePosition(stockID, name, AssetType.Stock);
            }}
          />
        );
      case AssetType.Crypto:
        return (
          <CryptoTable
            belongsTo={portfolio.userID}
            crypto={portfolio.crypto}
            unit={unit}
            onAddAsset={() => setDefaultAssetTypeToAdd(AssetType.Crypto)}
            onEdit={(position) => setEditPosition(position)}
            onDelete={(cryptoID, name) => {
              onDeletePosition(cryptoID, name, AssetType.Crypto);
            }}
          />
        );
      case AssetType.Cash:
        return (
          <CashTable
            belongsTo={portfolio.userID}
            cash={portfolio.cash}
            onAddAsset={() => setDefaultAssetTypeToAdd(AssetType.Cash)}
            onEdit={(position) => setEditPosition(position)}
            onDelete={(cashID, accountName) => {
              onDeletePosition(cashID, accountName, AssetType.Cash);
            }}
          />
        );
      case AssetType.RealEstate:
        return (
          <RealEstateTable
            belongsTo={portfolio.userID}
            onAddAsset={() => setDefaultAssetTypeToAdd(AssetType.RealEstate)}
            realEstate={portfolio.realEstate}
            onEdit={(position) => setEditPosition(position)}
            onDelete={(realEstateID, name) => {
              onDeletePosition(realEstateID, name, AssetType.RealEstate);
            }}
          />
        );
      case AssetType.Custom:
        return (
          <CustomAssetsTable
            belongsTo={portfolio.userID}
            onAddAsset={() => setDefaultAssetTypeToAdd(AssetType.Custom)}
            onEdit={(position) => setEditPosition(position)}
            customs={portfolio.customs}
            onDelete={(customID, name) => {
              onDeletePosition(customID, name, AssetType.Custom);
            }}
          />
        );
      default:
        return null;
    }
  }, [portfolio, activeTab, unit]);

  const renderEditModal = useMemo(() => {
    if (!editPosition || !portfolio) {
      return null;
    }

    const stopEditing = (reload: boolean) => {
      setEditPosition(null);
      if (reload) {
        loadPortfolioData();
      }
    };

    if (editPosition.assetType === AssetType.Stock) {
      return (
        <EditStockModal
          open={editPosition !== null}
          position={editPosition as StockPosition}
          portfolioID={portfolio.id}
          onClose={stopEditing}
        />
      );
    }

    if (editPosition.assetType === AssetType.Crypto) {
      return (
        <EditCryptoModal
          open={editPosition !== null}
          position={editPosition as CryptoPosition}
          portfolioID={portfolio.id}
          onClose={stopEditing}
        />
      );
    }

    if (editPosition.assetType === AssetType.RealEstate) {
      return (
        <EditRealEstateModal
          open={editPosition !== null}
          position={editPosition as RealEstatePosition}
          portfolioID={portfolio.id}
          onClose={stopEditing}
        />
      );
    }

    if (editPosition.assetType === AssetType.Cash) {
      return (
        <EditCashModal
          open={editPosition !== null}
          position={editPosition as CashPosition}
          portfolioID={portfolio.id}
          onClose={stopEditing}
        />
      );
    }

    if (editPosition.assetType === AssetType.Custom) {
      return (
        <EditCustomModal
          open={editPosition !== null}
          position={editPosition as CustomPosition}
          portfolioID={portfolio.id}
          onClose={stopEditing}
        />
      );
    }
  }, [editPosition, portfolio]);

  const renderMainContent = () => {
    if (error) {
      return (
        <div className="max-w-md p-8 mx-auto bg-white rounded-md">
          <p className="mb-6 text-xl font-medium text-center">{error}</p>
          <Link href="/portfolios">
            <Button type="button">Go Back</Button>
          </Link>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center mt-32">
          <Spinner />
        </div>
      );
    }

    if (portfolio) {
      return (
        <>
          <ConfirmModal {...confirmModalProps} />

          {renderEditModal}

          <div>
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center">
                {auth.user?.id === portfolio.userID && (
                  <Link href={`/portfolios`}>
                    <ArrowCircleLeftIcon className="w-6 h-6 mr-3 cursor-pointer hover:opacity-70" />
                  </Link>
                )}

                <h1 className="font-bold text-[1.75rem] mr-4">{portfolio.name}</h1>

                {!portfolio.settings.private && (
                  <p className="px-2 py-1 text-xs font-medium rounded-full text-darkgray bg-gray">
                    Public
                  </p>
                )}
              </div>
              {auth.user?.id === portfolio.userID && (
                <div className="flex items-center">
                  <div className="mr-3 w-44">
                    <Button
                      type="button"
                      onClick={() => setAddingAsset(true)}
                      variant="primary"
                    >
                      + Add Asset
                    </Button>
                  </div>

                  <div className="w-44">
                    <Link href={`/portfolios/${portfolio.id}/settings`}>
                      <Button type="button" variant="secondary">
                        Settings
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div
              className="grid grid-cols-2 grid-rows-1 gap-6 mb-7 h-72"
              style={{ minWidth: MIN_WIDTH }}
            >
              <BalanceOverTime portfolioID={portfolio.id} portfolioTotal={portfolioTotal} />

              <div className="grid grid-cols-3 gap-6">
                <AssetPercentCard
                  amount={portfolio.stocksTotal}
                  percentDecimal={portfolio.stocksTotal / portfolioTotal}
                  strokeColor={AssetColor.Stocks}
                  assetType={AssetType.Stock}
                  selected={activeTab === AssetType.Stock}
                  onClick={() => setActiveTab(AssetType.Stock)}
                />
                <AssetPercentCard
                  amount={portfolio.cryptoTotal}
                  percentDecimal={portfolio.cryptoTotal / portfolioTotal}
                  strokeColor={AssetColor.Crypto}
                  assetType={AssetType.Crypto}
                  selected={activeTab === AssetType.Crypto}
                  onClick={() => setActiveTab(AssetType.Crypto)}
                />
                <AssetPercentCard
                  amount={portfolio.realEstateTotal}
                  percentDecimal={portfolio.realEstateTotal / portfolioTotal}
                  strokeColor={AssetColor.RealEstate}
                  assetType={AssetType.RealEstate}
                  selected={activeTab === AssetType.RealEstate}
                  onClick={() => setActiveTab(AssetType.RealEstate)}
                />
                <AssetPercentCard
                  amount={portfolio.cashTotal}
                  percentDecimal={portfolio.cashTotal / portfolioTotal}
                  strokeColor={AssetColor.Cash}
                  assetType={AssetType.Cash}
                  selected={activeTab === AssetType.Cash}
                  onClick={() => setActiveTab(AssetType.Cash)}
                />

                <AssetPercentCard
                  amount={portfolio.customsTotal}
                  percentDecimal={portfolio.customsTotal / portfolioTotal}
                  strokeColor={AssetColor.Custom}
                  assetType={AssetType.Custom}
                  selected={activeTab === AssetType.Custom}
                  onClick={() => setActiveTab(AssetType.Custom)}
                />
              </div>
            </div>

            <div className="flex justify-end mb-2">
              <Link href={`/portfolios/${router.query.portfolioID}/history`}>
                <div className="inline-block text-sm font-medium text-evergreen hover:opacity-75">
                  View History
                </div>
              </Link>
            </div>

            <div
              style={{ minWidth: MIN_WIDTH }}
              className="px-5 py-4 mb-32 bg-white border rounded-md border-bordergray"
            >
              <div className="flex mb-7">
                <div className="w-48 mr-5">
                  <Select
                    onChange={(selected) => setActiveTab(selected as any)}
                    options={[
                      { label: 'Stock', value: AssetType.Stock },
                      { label: 'Crypto', value: AssetType.Crypto },
                      { label: 'Real Estate', value: AssetType.RealEstate },
                      { label: 'Cash', value: AssetType.Cash },
                      { label: 'Custom Assets', value: AssetType.Custom },
                    ]}
                    selected={activeTab}
                  />
                </div>

                {[AssetType.Stock, AssetType.Crypto].includes(activeTab) && (
                  <div className="flex items-center">
                    {[Unit.Dollars, Unit.Percents].map((u) => (
                      <button
                        key={u}
                        onClick={() => setUnit(u)}
                        className={classNames(
                          'text-[1rem] px-3 py-2 font-semibold rounded-md hover:bg-gray',
                          u === unit ? 'border-evergreen text-evergreen' : 'text-darkgray'
                        )}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {renderTable}
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <Layout title={`${portfolio?.name ?? 'Portfolio'} | Obsidian Tracker`}>
      {portfolio && (
        <FullScreenModal
          isOpen={addingAsset || !!defaultAssetTypeToAdd}
          onClose={() => {
            setAddingAsset(false);
            setDefaultAssetTypeToAdd(null);
          }}
        >
          <AddAssetForm
            portfolioName={portfolio.name}
            portfolioID={portfolio.id}
            defaultAssetType={defaultAssetTypeToAdd}
            onClose={async (assetTypeAdded) => {
              await loadPortfolioData();
              setActiveTab(assetTypeAdded);
              setAddingAsset(false);
              setDefaultAssetTypeToAdd(null);
            }}
          />
        </FullScreenModal>
      )}

      {renderMainContent()}
    </Layout>
  );
};

export default PortfolioView;
