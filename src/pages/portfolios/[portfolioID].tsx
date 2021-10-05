import { AssetColor, AssetType, PortfolioWithQuotes } from '@zachweinberg/wealth-schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import BalanceHistoryChart from '~/components/charts/BalanceHistoryChart';
import Layout from '~/components/layout/Layout';
import AddAssetForm from '~/components/portfolio-view/AddAssetForm';
import AssetPercentCard from '~/components/portfolio-view/AssetPercentCard';
import StocksTable from '~/components/tables/StocksTable';
import Button from '~/components/ui/Button';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Link from '~/components/ui/Link';
import Select from '~/components/ui/Select';
import Spinner from '~/components/ui/Spinner';
import { API } from '~/lib/api';

const PortfolioView: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingAsset, setAddingAsset] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioWithQuotes | null>(null);
  const [activeTab, setActiveTab] = useState<AssetType | 'All Assets'>('All Assets');
  const [unit, setUnit] = useState<'Dollar' | 'Percent'>('Dollar');
  const [error, setError] = useState('');

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
  const portfolioTotal = useMemo(
    () =>
      (portfolio?.cashTotal ?? 0) +
      (portfolio?.cryptoTotal ?? 0) +
      (portfolio?.stocksTotal ?? 0) +
      (portfolio?.customsTotal ?? 0) +
      (portfolio?.realEstateTotal ?? 0),
    [portfolio]
  );

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
          <div className="flex items-center justify-between mb-7">
            <h1 className="font-bold text-[1.75rem]">{portfolio.name}</h1>
            <div className="w-44">
              <Button type="button" onClick={() => setAddingAsset(true)} secondary>
                + Add Asset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 grid-rows-2 gap-4 lg:grid-rows-1 lg:grid-cols-2 mb-7">
            <div className="w-full h-full px-5 py-12 bg-dark rounded-3xl">
              <BalanceHistoryChart
                data={portfolio.dailyBalances.map((d) => ({
                  balance: d.totalValue,
                  date: d.date,
                }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          <div className="px-5 py-4 bg-white border rounded-3xl border-bordergray">
            <div className="flex mb-7">
              <div className="mr-5 w-44">
                <Select
                  onChange={(selected) => setActiveTab(selected as any)}
                  options={[
                    'All Assets',
                    AssetType.Stock,
                    AssetType.Crypto,
                    AssetType.RealEstate,
                    AssetType.Cash,
                  ]}
                  selected={activeTab}
                />
              </div>

              <div className="flex items-center font-manrope">
                {['Dollar', 'Percent'].map((u) => (
                  <button
                    key={u}
                    onClick={() => setUnit(u as any)}
                    className={classNames(
                      'text-[1rem] h-full px-4 py-2 mr-3 font-bold border rounded-md text-darkgray hover:bg-light',
                      { 'border-evergreen text-evergreen': u === unit }
                    )}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <StocksTable stocks={portfolio.stocks} />
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <Layout title={portfolio?.name ?? 'Portfolio'}>
      {portfolio && (
        <FullScreenModal isOpen={addingAsset} onClose={() => setAddingAsset(false)}>
          <AddAssetForm
            portfolioName={portfolio.name}
            portfolioID={portfolio.id}
            onClose={() => {
              loadPortfolioData();
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
