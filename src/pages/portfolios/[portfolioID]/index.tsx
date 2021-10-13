import {
  AssetColor,
  AssetType,
  PortfolioWithQuotes,
  Unit,
} from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import BalanceHistoryChart from '~/components/charts/BalanceHistoryChart';
import Layout from '~/components/layout/Layout';
import AddAssetForm from '~/components/portfolio-view/AddAssetForm';
import AssetPercentCard from '~/components/portfolio-view/AssetPercentCard';
import CashTable from '~/components/tables/CashTable';
import CryptoTable from '~/components/tables/CryptoTable';
import CustomAssetsTable from '~/components/tables/CustomAssetsTable';
import RealEstateTable from '~/components/tables/RealEstateTable';
import StocksTable from '~/components/tables/StocksTable';
import Button from '~/components/ui/Button';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Link from '~/components/ui/Link';
import Modal from '~/components/ui/Modal';
import Select from '~/components/ui/Select';
import Spinner from '~/components/ui/Spinner';
import { API } from '~/lib/api';

const PortfolioView: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingAsset, setAddingAsset] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioWithQuotes | null>(null);
  const [activeTab, setActiveTab] = useState<AssetType>(AssetType.Stock);
  const [unit, setUnit] = useState<Unit>(Unit.Dollars);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAsset, setDeleteAsset] = useState<{
    type: AssetType;
    id: string;
    name: string;
  } | null>(null);

  const loadPortfolioData = async () => {
    setLoading(true);

    try {
      const portfolioData = await API.getPortfolio(router.query.portfolioID as string);
      setPortfolio(portfolioData.portfolio);
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
    loadPortfolioData();
  }, []);

  const renderTable = () => {
    if (portfolio) {
      switch (activeTab) {
        case AssetType.Stock:
          return (
            <StocksTable
              stocks={portfolio.stocks}
              unit={unit}
              onAddAsset={() => setAddingAsset(true)}
              onDelete={(stockID, name) => {
                setDeleteAsset({ id: stockID, type: AssetType.Stock, name });
                setIsDeleting(true);
              }}
            />
          );
        case AssetType.Crypto:
          return (
            <CryptoTable
              crypto={portfolio.crypto}
              unit={unit}
              onAddAsset={() => setAddingAsset(true)}
              onDelete={(cryptoID, name) => {
                setDeleteAsset({ id: cryptoID, type: AssetType.Crypto, name });
                setIsDeleting(true);
              }}
            />
          );
        case AssetType.Cash:
          return (
            <CashTable
              unit={unit}
              cash={portfolio.cash}
              onAddAsset={() => setAddingAsset(true)}
              onDelete={(cashID, name) => {
                setDeleteAsset({ id: cashID, type: AssetType.Cash, name });
                setIsDeleting(true);
              }}
            />
          );
        case AssetType.RealEstate:
          return (
            <RealEstateTable
              unit={unit}
              realEstate={portfolio.realEstate}
              onAddAsset={() => setAddingAsset(true)}
              onDelete={(realEstateID, name) => {
                setDeleteAsset({ id: realEstateID, type: AssetType.RealEstate, name });
                setIsDeleting(true);
              }}
            />
          );
        case AssetType.Custom:
          return (
            <CustomAssetsTable
              unit={unit}
              customs={portfolio.customs}
              onAddAsset={() => setAddingAsset(true)}
              onDelete={(customID, name) => {
                setDeleteAsset({ id: customID, type: AssetType.Custom, name });
                setIsDeleting(true);
              }}
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  };

  const portfolioTotal = useMemo(
    () =>
      (portfolio?.cashTotal ?? 0) +
      (portfolio?.cryptoTotal ?? 0) +
      (portfolio?.stocksTotal ?? 0) +
      (portfolio?.customsTotal ?? 0) +
      (portfolio?.realEstateTotal ?? 0),
    [portfolio]
  );

  const onDeleteAsset = async () => {
    if (deleteAsset && portfolio) {
      await API.deleteAssetFromPortfolio(deleteAsset.id, portfolio.id);
      setIsDeleting(false);
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
          <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)}>
            <div className="p-7">
              <p className="mb-4 text-lg font-bold">
                Remove {deleteAsset?.name} from this portfolio?
              </p>
              <div className="flex items-center">
                <Button type="button" className="mr-2" onClick={() => setIsDeleting(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="danger" onClick={onDeleteAsset}>
                  Delete
                </Button>
              </div>
            </div>
          </Modal>

          <div className="pb-16">
            <div className="flex items-center justify-between mb-7">
              <h1 className="font-bold text-[1.75rem]">{portfolio.name}</h1>
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
            </div>

            <div className="grid grid-cols-1 grid-rows-2 gap-4 lg:grid-rows-1 lg:grid-cols-2 mb-7">
              <div className="relative px-5 bg-dark rounded-3xl">
                <BalanceHistoryChart
                  data={portfolio.dailyBalances.map((d) => ({
                    balance: d.totalValue,
                    date: d.date,
                  }))}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
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

            <div className="px-5 py-4 bg-white border rounded-3xl border-bordergray">
              <div className="flex mb-7">
                <div className="mr-5 w-44">
                  <Select
                    onChange={(selected) => setActiveTab(selected as any)}
                    options={[
                      AssetType.Stock,
                      AssetType.Crypto,
                      AssetType.RealEstate,
                      AssetType.Cash,
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

              {renderTable()}
            </div>
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Layout title={`${portfolio?.name ?? 'Portfolio'} - Obsidian Tracker`}>
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
