import { PlusIcon } from '@heroicons/react/solid';
import { PortfolioWithBalances } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Button from '~/components/Button';
import CreatePortfolioForm from '~/components/form/CreatePortfolioForm';
import FullScreenModal from '~/components/FullScreenModal';
import Layout from '~/components/Layout';
import PortfolioSummaryCard from '~/components/PortfolioSummaryCard';
import Spinner from '~/components/Spinner';
import { API } from '~/lib/api';

const PortfolioListPage: NextPage = () => {
  const [creatingPortfolio, setCreatingPortfolio] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioWithBalances[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPortfolios = async () => {
    setLoading(true);
    try {
      const portfoliosData = await API.getPortfolios();
      if (portfoliosData.portfolios) {
        setPortfolios(portfoliosData.portfolios);
      }
    } catch (err) {
      setError('Somethign went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const renderContent = () => {
    if (error) {
      return <p>{error}</p>;
    }

    if (loading) {
      return (
        <div className="flex items-center justify-center mt-32">
          <Spinner size={40} />
        </div>
      );
    }

    if (portfolios && portfolios.length === 0) {
      return (
        <div className="max-w-md mx-auto">
          <CreatePortfolioForm firstTime afterCreate={() => loadPortfolios()} />
        </div>
      );
    }

    if (portfolios && portfolios.length > 0) {
      return (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
                My Portfolios
              </h2>
            </div>
            <div>
              <Button
                onClick={() => setCreatingPortfolio(true)}
                type="button"
                disabled={portfolios.length >= 2}
              >
                <PlusIcon className="w-5 h-4 mr-2 -ml-1" aria-hidden="true" />
                Create portfolio
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {portfolios.map((portfolio) => (
              <Link href={`/portfolios/${portfolio.id}`} key={portfolio.id}>
                <a>
                  <PortfolioSummaryCard portfolio={portfolio} />
                </a>
              </Link>
            ))}
          </div>
        </>
      );
    }
    return null;
  };

  return (
    <RequiredLoggedIn>
      <Layout title="My Portfolios">
        <FullScreenModal
          isOpen={creatingPortfolio}
          onClose={() => setCreatingPortfolio(false)}
        >
          <div className="max-w-sm mx-auto">
            <CreatePortfolioForm
              afterCreate={() => {
                loadPortfolios();
                setCreatingPortfolio(false);
              }}
            />
          </div>
        </FullScreenModal>

        {renderContent()}
      </Layout>
    </RequiredLoggedIn>
  );
};

export default PortfolioListPage;
