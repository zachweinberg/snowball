import { PlusIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Button from '~/components/Button';
import CreatePortfolioForm from '~/components/forms/CreatePortfolioForm';
import FullScreenModal from '~/components/FullScreenModal';
import Layout from '~/components/Layout';
import PortfolioSummaryCard from '~/components/PortfolioSummaryCard';
import Spinner from '~/components/Spinner';
import Tabs from '~/components/Tabs';
import { API } from '~/lib/api';

const PortfolioListPage: NextPage = () => {
  const [creatingPortfolio, setCreatingPortfolio] = useState(false);

  const { data: portfoliosData, error } = useSWR('portfolios', API.getPortfolios, {});

  const renderContent = () => {
    if (error) {
      return null;
    }

    if (!portfoliosData) {
      return (
        <div className="flex items-center justify-center mt-32">
          <Spinner size={40} />
        </div>
      );
    }

    if (portfoliosData && portfoliosData.portfolios.length === 0) {
      return (
        <div className="max-w-md mx-auto">
          <CreatePortfolioForm firstTime />
        </div>
      );
    }

    if (portfoliosData && portfoliosData.portfolios.length > 0) {
      return (
        <>
          <FullScreenModal
            isOpen={creatingPortfolio}
            onClose={() => setCreatingPortfolio(false)}
          >
            <div className="max-w-sm mx-auto">
              <CreatePortfolioForm />
            </div>
          </FullScreenModal>
          <div className="flex justify-between">
            <div>
              <h2 className="mb-4 text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
                My Portfolios
              </h2>
              <Tabs
                active={'1d'}
                options={[
                  { label: '1d', onClick: () => null },
                  { label: '1m', onClick: () => null },
                  { label: '3m', onClick: () => null },
                  { label: '1yr', onClick: () => null },
                  { label: '2yr', onClick: () => null },
                ]}
              />
            </div>
            <div>
              <Button onClick={() => setCreatingPortfolio(true)} type="button">
                <PlusIcon className="w-5 h-4 mr-2 -ml-1" aria-hidden="true" />
                Add Portfolio
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {portfoliosData.portfolios.map((portfolio) => (
              <Link href={`/portfolios/${portfolio.id}`}>
                <a>
                  <PortfolioSummaryCard portfolioName={portfolio.name} />
                </a>
              </Link>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <RequiredLoggedIn>
      <Layout title="My Portfolios">{renderContent()}</Layout>
    </RequiredLoggedIn>
  );
};

export default PortfolioListPage;
