import { PlusIcon, TrendingUpIcon } from '@heroicons/react/solid';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import MainChart from '~/components/MainChart';
import TableBase from '~/components/tables/TableBase';
import Tabs from '~/components/Tabs';

const PortfolioViewPage: NextPage = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <RequiredLoggedIn>
      <Layout title="Portfolio">
        {/* <FullScreenModal isOpen={modalOpen} onClose={() => setModalOpen(false)} /> */}

        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-4 text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
              Zach's Portfolio
            </h2>
            <Tabs
              active={'1d'}
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
          <div>
            <Button type="button">
              <PlusIcon className="w-5 h-4 mr-2 -ml-1" aria-hidden="true" />
              Add Stock
            </Button>
          </div>
        </div>

        <div className="mb-1">
          <div className="flex items-center text-green2">
            <div className="mt-2 text-3xl font-bold">$313,572</div>
            <div className="flex items-center">
              <div className="mx-3 mt-2 font-semibold text-md">+21.01%</div>
              <TrendingUpIcon className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" />
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
      </Layout>
    </RequiredLoggedIn>
  );
};

export default PortfolioViewPage;
