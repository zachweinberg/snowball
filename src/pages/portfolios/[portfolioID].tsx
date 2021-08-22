import { ChevronUpIcon, PlusIcon } from '@heroicons/react/solid';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '~/components/Button';
import Layout from '~/components/Layout';
import MainChart from '~/components/MainChart';
import TableBase from '~/components/tables/TableBase';
import Tabs from '~/components/Tabs';
import { API } from '~/lib/api';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const response = await API.getPortfolio(ctx.query.portfolioID as string);
    return { props: { portfolio: response.portfolio } };
  } catch (err) {
    if (err.response.status === 404) {
      return {
        notFound: true,
      };
    }
    throw err;
  }
};

const PortfolioViewPage: NextPage = (props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  console.log(props);
  // const { data: portfolioData, error } = useSWR(
  //   'portfolios',
  //   () => API.getPortfolio(router.query.portfoioID as string),
  //   {
  //     revalidateOnFocus: false,
  //     revalidateOnReconnect: true,
  //   }
  // );

  return (
    <Layout title="Portfolio">
      {/* <FullScreenModal isOpen={modalOpen} onClose={() => setModalOpen(false)} /> */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-3 text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
            Zach's Portfolio
          </h2>
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
          <Button type="button">
            <PlusIcon className="w-5 h-4 mr-2 -ml-1" aria-hidden="true" />
            Add Stock
          </Button>
        </div>
      </div>

      <div className="inline-block p-4 bg-white rounded-md shadow-sm">
        <p className="text-sm text-purple2">Total Value:</p>
        <div className="flex items-center mb-1">
          <div className="mr-5 text-4xl font-light text-purple2">$514,272.41</div>
          <div className="flex items-center ml-5 text-green2">
            <div className="mr-2 text-xl font-semibold">+12,424.42</div>
            <ChevronUpIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex items-center ml-5 text-green2">
            <div className="mr-2 text-xl font-semibold">+21.01%</div>
            <ChevronUpIcon className="w-5 h-5" aria-hidden="true" />
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
  );
};

export default PortfolioViewPage;
