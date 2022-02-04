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
} from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import AddAssetForm from '~/components/add-assets/AddAssetForm';
import BalanceOverTime from '~/components/charts/BalanceOverTime';
import Layout from '~/components/layout/Layout';
import { DeletePositionModal } from '~/components/modals/DeletePositionModal';
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
  const [portfolio, setPortfolio] = useState<PortfolioWithQuotes | null>(null);
  const [activeTab, setActiveTab] = useState<AssetType>(AssetType.Stock);
  const [unit, setUnit] = useState<Unit>(Unit.Dollars);
  const [error, setError] = useState('');

  const [deleteAsset, setDeleteAsset] = useState<{
    type: AssetType;
    id: string;
    name: string;
  } | null>(null);

  const [editPosition, setEditPosition] = useState<PositionType | null>(null);

  const portfolioTotal = useMemo(
    () =>
      (portfolio?.cashTotal ?? 0) +
      (portfolio?.cryptoTotal ?? 0) +
      (portfolio?.stocksTotal ?? 0) +
      (portfolio?.customsTotal ?? 0) +
      (portfolio?.realEstateTotal ?? 0),
    [portfolio]
  );

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

  const renderTable = useMemo(() => {
    if (portfolio) {
      switch (activeTab) {
        case AssetType.Stock:
          return (
            <StocksTable
              belongsTo={portfolio.userID}
              stocks={portfolio.stocks}
              unit={unit}
              onAddAsset={() => setAddingAsset(true)}
              onEdit={(position) => setEditPosition(position)}
              onDelete={(stockID, name) => {
                setDeleteAsset({ id: stockID, type: AssetType.Stock, name });
              }}
            />
          );
        case AssetType.Crypto:
          return (
            <CryptoTable
              belongsTo={portfolio.userID}
              crypto={portfolio.crypto}
              unit={unit}
              onAddAsset={() => setAddingAsset(true)}
              onEdit={(position) => setEditPosition(position)}
              onDelete={(cryptoID, name) => {
                setDeleteAsset({ id: cryptoID, type: AssetType.Crypto, name });
              }}
            />
          );
        case AssetType.Cash:
          return (
            <CashTable
              belongsTo={portfolio.userID}
              cash={portfolio.cash}
              onAddAsset={() => setAddingAsset(true)}
              onEdit={(position) => setEditPosition(position)}
              onDelete={(cashID) => {
                setDeleteAsset({
                  id: cashID,
                  type: AssetType.Cash,
                  name: 'this cash account',
                });
              }}
            />
          );
        case AssetType.RealEstate:
          return (
            <RealEstateTable
              belongsTo={portfolio.userID}
              realEstate={portfolio.realEstate}
              onAddAsset={() => setAddingAsset(true)}
              onEdit={(position) => setEditPosition(position)}
              onDelete={(realEstateID) => {
                setDeleteAsset({
                  id: realEstateID,
                  type: AssetType.RealEstate,
                  name: 'this property',
                });
              }}
            />
          );
        case AssetType.Custom:
          return (
            <CustomAssetsTable
              belongsTo={portfolio.userID}
              onEdit={(position) => setEditPosition(position)}
              customs={portfolio.customs}
              onAddAsset={() => setAddingAsset(true)}
              onDelete={(customID) => {
                setDeleteAsset({
                  id: customID,
                  type: AssetType.Custom,
                  name: 'this custom asset',
                });
              }}
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }, [portfolio, activeTab, unit]);

  const renderEditModal = useMemo(() => {
    if (!editPosition || !portfolio) {
      return null;
    }
    const onClose = (reload: boolean) => {
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
          onClose={onClose}
        />
      );
    }

    if (editPosition.assetType === AssetType.Crypto) {
      return (
        <EditCryptoModal
          open={editPosition !== null}
          position={editPosition as CryptoPosition}
          portfolioID={portfolio.id}
          onClose={onClose}
        />
      );
    }

    if (editPosition.assetType === AssetType.RealEstate) {
      return (
        <EditRealEstateModal
          open={editPosition !== null}
          position={editPosition as RealEstatePosition}
          portfolioID={portfolio.id}
          onClose={onClose}
        />
      );
    }

    if (editPosition.assetType === AssetType.Cash) {
      return (
        <EditCashModal
          open={editPosition !== null}
          position={editPosition as CashPosition}
          portfolioID={portfolio.id}
          onClose={onClose}
        />
      );
    }

    if (editPosition.assetType === AssetType.Custom) {
      return (
        <EditCustomModal
          open={editPosition !== null}
          position={editPosition as CustomPosition}
          portfolioID={portfolio.id}
          onClose={onClose}
        />
      );
    }
  }, [editPosition, portfolio]);

  const onDeleteAsset = async () => {
    if (deleteAsset && portfolio) {
      await API.deleteAssetFromPortfolio(deleteAsset.id, deleteAsset.type, portfolio.id);
      setDeleteAsset(null);
      loadPortfolioData();
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="max-w-md p-8 mx-auto bg-white rounded-md">
          <p className="mb-6 text-xl font-medium text-center text-purple2">{error}</p>
          <Link href="/portfolios">
            <Button type="button">Go Back</Button>
          </Link>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center mt-32">
          <Spinner size={40} />
        </div>
      );
    }

    if (portfolio) {
      return (
        <>
          <DeletePositionModal
            open={deleteAsset !== null}
            onClose={() => setDeleteAsset(null)}
            onDelete={onDeleteAsset}
            assetName={deleteAsset?.name ?? ''}
          />

          {renderEditModal}

          <div>
            <div className="flex items-center justify-between mb-7">
              <div className="flex items-center">
                {auth.user && (
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
              {auth.user && (
                <div className="flex items-center">
                  <div className="mr-3 w-44">
                    <Button
                      type="button"
                      onClick={() => setAddingAsset(true)}
                      variant="secondary"
                    >
                      + Add Asset
                    </Button>
                  </div>

                  <div className="w-44">
                    <Link href={`/portfolios/${portfolio.id}/settings`}>
                      <Button
                        type="button"
                        variant="secondary"
                        className="flex items-center justify-center"
                      >
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
                <a className="inline-block text-sm font-medium text-evergreen hover:opacity-75">
                  View History
                </a>
              </Link>
            </div>

            <div
              style={{ minWidth: MIN_WIDTH }}
              className="px-5 py-4 mb-32 bg-white border rounded-3xl border-bordergray"
            >
              <div className="flex mb-7">
                <div className="mr-5 w-44">
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

                <div className="flex items-center">
                  {[Unit.Dollars, Unit.Percents].map((u) => (
                    <button
                      key={u}
                      onClick={() => setUnit(u)}
                      className={classNames(
                        'text-[1rem] px-3 py-2 font-semibold  rounded-md text-darkgray hover:bg-light',
                        { 'border-evergreen text-evergreen': u === unit }
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
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
        <FullScreenModal isOpen={addingAsset} onClose={() => setAddingAsset(false)}>
          <AddAssetForm
            portfolioName={portfolio.name}
            portfolioID={portfolio.id}
            onClose={async (assetTypeAdded) => {
              await loadPortfolioData();
              setActiveTab(assetTypeAdded);
              setAddingAsset(false);
            }}
          />
        </FullScreenModal>
      )}

      {renderContent()}
    </Layout>
  );
};

export default PortfolioView;
