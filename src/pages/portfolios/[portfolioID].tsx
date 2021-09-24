import { ChevronDownIcon } from '@heroicons/react/outline';
import { AssetType, PortfolioWithQuotes } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AddAssetForm from '~/components/form/AddAssetForm';
import Layout from '~/components/layout/Layout';
import AssetPercentCard from '~/components/portfolio-view/AssetPercentCard';
import BalanceOverTimeChart from '~/components/portfolio-view/BalanceOverTimeChart';
import StocksTable from '~/components/tables/StocksTable';
import Button from '~/components/ui/Button';
import Dropdown from '~/components/ui/Dropdown';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Link from '~/components/ui/Link';
import Spinner from '~/components/ui/Spinner';
import { API } from '~/lib/api';

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../../tailwind.config');
const { theme } = resolveConfig(tailwindConfig);

const PortfolioView: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingAsset, setAddingAsset] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioWithQuotes | null>(null);
  const [activeTab, setActiveTab] = useState('All');
  const [error, setError] = useState('');

  const loadPortfolio = async () => {
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
    loadPortfolio();
  }, []);

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
                + Add asset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
            <div className="h-64 lg:h-full">
              <BalanceOverTimeChart />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
              <AssetPercentCard
                amount={98}
                percentDecimal={0.7182}
                strokeColor={theme.colors['lime']}
                assetType={AssetType.Stock}
              />
              <AssetPercentCard
                amount={124992.12}
                percentDecimal={0.2182}
                strokeColor={theme.colors['purple']}
                assetType={AssetType.RealEstate}
              />
              <AssetPercentCard
                amount={412.32}
                percentDecimal={0.7182}
                strokeColor={theme.colors['evergreen']}
                assetType={AssetType.Crypto}
              />
              <AssetPercentCard
                amount={41212.32}
                percentDecimal={0.6182}
                strokeColor={theme.colors['rust']}
                assetType={AssetType.Cash}
              />
            </div>
          </div>

          <div className="px-5 py-4 bg-white border rounded-3xl border-bordergray">
            <div className="flex justify-between mb-3">
              <Dropdown
                options={[{ label: 'Stocks' }, { label: 'Crypto' }]}
                button={() => (
                  <div className="flex items-center p-3 mb-4 border border-bordergray rounded-2xl">
                    <p className="text-[1.1rem] font-semibold">Stocks</p>
                    <ChevronDownIcon className="w-5 h-5 ml-2 font-semibold text-dark" />
                  </div>
                )}
              />

              <div className="flex items-center text-[1.4rem] text-evergreen">
                <button className="px-4 py-2 mr-3 font-medium border-2 border-evergreen rounded-xl">
                  $
                </button>
                <button className="px-4 py-2 font-medium border-2 border-bordergray rounded-xl hover:bg-bordergray">
                  %
                </button>
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
    <Layout title={portfolio?.name ?? 'My Portfolio'}>
      {portfolio && (
        <FullScreenModal isOpen={addingAsset} onClose={() => setAddingAsset(false)}>
          <AddAssetForm
            portfolioName={portfolio.name}
            portfolioID={portfolio.id}
            onClose={() => {
              loadPortfolio();
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
