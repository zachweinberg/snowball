import { ChevronUpIcon, PlusIcon } from '@heroicons/react/solid';
import { Portfolio } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Button from '~/components/Button';
import AddAssetForm from '~/components/form/AddAssetForm';
import FullScreenModal from '~/components/FullScreenModal';
import Layout from '~/components/Layout';
import MainChart from '~/components/MainChart';
import Spinner from '~/components/Spinner';
import TableBase from '~/components/tables/TableBase';
import Tabs from '~/components/Tabs';
import { API } from '~/lib/api';

const PortfolioViewPage: NextPage = () => {
  const router = useRouter();
  const [addingAsset, setAddingAsset] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPortfolio = async () => {
    setLoading(true);

    try {
      const portfolioData = await API.getPortfolio(router.query.portfolioID as string);
      setPortfolio(portfolioData.portfolio);
    } catch (err) {
      if (err.response.status === 404) {
        setError("We couldn't find that portfolio.");
      } else {
        setError('Something went wrong.');
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
        <div className="max-w-md p-8 mx-auto bg-white rounded-md shadow-md">
          <p className="mb-6 text-xl font-medium text-center text-purple2">{error}</p>
          <Link href="/portfolios">
            <a>
              <Button type="button">Go Back</Button>
            </a>
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
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center">
                <h2 className="mb-3 text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
                  {portfolio.name}
                </h2>
                {portfolio.public && (
                  <div className="px-3 py-1 ml-3 text-xs font-medium rounded-full bg-gray6 text-purple2">
                    Public
                  </div>
                )}
              </div>

              <div className="mb-9">
                <Tabs
                  active={'All'}
                  options={[
                    { label: 'All', onClick: () => null },
                    { label: 'Stocks', onClick: () => null },
                    { label: 'Crypto', onClick: () => null },
                    { label: 'Real Estate', onClick: () => null },
                    { label: 'Cash', onClick: () => null },
                    { label: 'Custom', onClick: () => null },
                  ]}
                />
              </div>
            </div>
            <div>
              <Button type="button" onClick={() => setAddingAsset(true)}>
                <PlusIcon className="w-5 h-4 mr-2 -ml-1" aria-hidden="true" />
                Add Asset
              </Button>
            </div>
          </div>

          <div className="inline-block">
            <p className="text-sm text-purple2">Total Value:</p>
            <div className="flex items-center mb-1">
              <div className="mr-5 text-4xl font-light text-purple2">$514,272.41</div>
              <div className="flex items-center ml-5 text-green2">
                <div className="mr-2 text-xl font-semibold">+12,424.42</div>
              </div>
              <div className="flex items-center ml-5 text-green2">
                <ChevronUpIcon className="w-5 h-5" aria-hidden="true" />
                <div className="mr-2 text-xl font-semibold">21.01%</div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="flex justify-end w-full mb-2">
              <div className="flex items-center p-2 text-sm font-semibold rounded-md">
                <div className="px-3 py-1 rounded-md cursor-pointer text-blue3 hover:bg-blue1 hover:text-white">
                  1D
                </div>
                <div className="px-3 py-1 rounded-md cursor-pointer text-blue3 hover:bg-blue1 hover:text-white">
                  7D
                </div>
                <div className="px-3 py-1 rounded-md cursor-pointer text-blue3 hover:bg-blue1 hover:text-white">
                  30D
                </div>
                <div className="px-3 py-1 rounded-md cursor-pointer text-blue3 hover:bg-blue1 hover:text-white">
                  90D
                </div>
                <div className="px-3 py-1 rounded-md cursor-pointer text-blue3 hover:bg-blue1 hover:text-white">
                  ALL
                </div>
              </div>
            </div>
            <MainChart />
          </div>

          <TableBase />
        </>
      );
    }
    return null;
  };

  return (
    <Layout title="Portfolio">
      {portfolio && (
        <FullScreenModal isOpen={addingAsset} onClose={() => setAddingAsset(false)}>
          <div className="max-w-md mx-auto">
            <AddAssetForm
              portfolioName={portfolio.name}
              portfolioID={portfolio.id}
              onClose={() => {
                loadPortfolio();
                setAddingAsset(false);
              }}
            />
          </div>
        </FullScreenModal>
      )}

      {renderContent()}
    </Layout>
  );
};

export default PortfolioViewPage;
