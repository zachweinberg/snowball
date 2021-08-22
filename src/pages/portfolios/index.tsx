import { PlusIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Button from '~/components/Button';
import CreatePortfolioForm from '~/components/forms/CreatePortfolioForm';
import FullScreenModal from '~/components/FullScreenModal';
import Layout from '~/components/Layout';
import PortfolioSummaryCard from '~/components/PortfolioSummaryCard';
import Tabs from '~/components/Tabs';

const PortfolioListPage: NextPage = () => {
  const [creatingPortfolio, setCreatingPortfolio] = useState(false);

  return (
    <RequiredLoggedIn>
      <Layout title="My Portfolios">
        <FullScreenModal
          isOpen={creatingPortfolio}
          onClose={() => setCreatingPortfolio(false)}
        >
          <div className="mx-auto max-w-sm">
            <CreatePortfolioForm />
          </div>
        </FullScreenModal>

        <div className="flex items-center justify-between">
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
          <Link href="/portfolios/asdf">
            <a>
              <PortfolioSummaryCard portfolioName="Zach's Portfolio" />
            </a>
          </Link>
        </div>
      </Layout>
    </RequiredLoggedIn>
  );
};

export default PortfolioListPage;
