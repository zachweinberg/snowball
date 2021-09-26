import { AssetType, PortfolioWithQuotes } from '@zachweinberg/wealth-schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import BalanceHistoryChart from '~/components/charts/BalanceHistoryChart';
import AddAssetForm from '~/components/form/AddAssetForm';
import Layout from '~/components/layout/Layout';
import AssetPercentCard from '~/components/portfolio-view/AssetPercentCard';
import StocksTable from '~/components/tables/StocksTable';
import Button from '~/components/ui/Button';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Link from '~/components/ui/Link';
import Select from '~/components/ui/Select';
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
  const [activeTab, setActiveTab] = useState('All Assets');
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
            <div className="h-64 lg:h-full bg-dark rounded-3xl">
              <BalanceHistoryChart
                width={225}
                height={100}
                data={[
                  { balance: 9876, date: 1632690171489 },
                  { balance: 9817, date: 1632690171813 },
                  { balance: 9400, date: 1632690171910 },
                  { balance: 10403, date: 1632690171950 },
                  { balance: 15403, date: 1632690174950 },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
              <AssetPercentCard
                amount={98}
                percentDecimal={0.7182}
                strokeColor={theme.colors['lime']}
                assetType={AssetType.Stock}
                selected={activeTab === 'Stocks'}
                onClick={() => setActiveTab('Stocks')}
              />
              <AssetPercentCard
                amount={124992.12}
                percentDecimal={0.2182}
                strokeColor={theme.colors['purple']}
                assetType={AssetType.RealEstate}
                selected={activeTab === 'Real Estate'}
                onClick={() => setActiveTab('Real Estate')}
              />
              <AssetPercentCard
                amount={412.32}
                percentDecimal={0.7182}
                strokeColor={theme.colors['evergreen']}
                assetType={AssetType.Crypto}
                selected={activeTab === 'Crypto'}
                onClick={() => setActiveTab('Crypto')}
              />
              <AssetPercentCard
                amount={41212.32}
                percentDecimal={0.6182}
                strokeColor={theme.colors['rust']}
                assetType={AssetType.Cash}
                selected={activeTab === 'Cash'}
                onClick={() => setActiveTab('Cash')}
              />
            </div>
          </div>

          <div className="px-5 py-4 bg-white border rounded-3xl border-bordergray">
            <div className="flex mb-7">
              <div className="mr-5 w-44">
                <Select
                  onChange={(selected) => setActiveTab(selected)}
                  options={['All Assets', 'Stocks', 'Crypto', 'Real Estate', 'Cash']}
                  selected={activeTab}
                />
              </div>

              <div className="flex items-center font-manrope">
                {['Dollar', 'Percent'].map((u) => (
                  <button
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
