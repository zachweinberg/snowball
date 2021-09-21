import { PortfolioWithBalances } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import CreatePortfolioForm from '~/components/portfolio-list/CreatePortfolioForm';
import PortfolioSummaryCard from '~/components/portfolio-list/PortfolioSummaryCard';
import Button from '~/components/ui/Button';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Spinner from '~/components/ui/Spinner';
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
      setError('Something went wrong...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  const renderContent = () => {
    if (error) {
      return <p className="text-darkgray">{error}</p>;
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
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <svg
            viewBox="0 0 150 150"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-8 w-28 h-28"
          >
            <circle cx="75" cy="75" r="75" fill="#EEEFF3" />
            <path
              d="M105.574 81.1523H103.523V75.1367C103.523 72.463 101.809 70.1822 99.4219 69.3357V62.832C99.4219 59.4396 96.6619 56.6797 93.2695 56.6797H50.2031C45.6799 56.6797 42 60.3596 42 64.8828V101.797C42 106.32 45.6799 110 50.2031 110H97.3711C100.763 110 103.523 107.24 103.523 103.848V97.5586H105.574C106.707 97.5586 107.625 96.6404 107.625 95.5078V83.2031C107.625 82.0705 106.707 81.1523 105.574 81.1523ZM50.2031 60.7812H93.2695C94.4003 60.7812 95.3203 61.7012 95.3203 62.832V68.9844H50.2031C47.9415 68.9844 46.1016 67.1444 46.1016 64.8828C46.1016 62.6212 47.9415 60.7812 50.2031 60.7812ZM99.4219 103.848C99.4219 104.978 98.5019 105.898 97.3711 105.898H50.2031C47.9415 105.898 46.1016 104.058 46.1016 101.797V71.9823C47.3092 72.6828 48.7095 73.0859 50.2031 73.0859H97.3711C98.5019 73.0859 99.4219 74.0059 99.4219 75.1367V81.1523H91.2188C90.6747 81.1523 90.1532 81.3685 89.7687 81.7531L83.6164 87.9054C82.8155 88.7063 82.8155 90.0047 83.6164 90.8056L89.7687 96.958C90.1532 97.3424 90.6747 97.5586 91.2188 97.5586H99.4219V103.848ZM103.523 93.457H92.0682L87.9666 89.3555L92.0682 85.2539H103.523V93.457Z"
              fill="#141414"
            />
            <path
              d="M72.7617 48.6133C73.8943 48.6133 74.8125 47.6951 74.8125 46.5625V42.0508C74.8125 40.9182 73.8943 40 72.7617 40C71.6291 40 70.7109 40.9182 70.7109 42.0508V46.5625C70.7109 47.6951 71.6291 48.6133 72.7617 48.6133Z"
              fill="#00565B"
            />
            <path
              d="M58.7498 49.3496L62.2059 52.2497C63.0791 52.9824 64.3716 52.8589 65.095 51.9969C65.823 51.1293 65.71 49.8358 64.8422 49.1077L61.3861 46.2077C60.5182 45.4795 59.2249 45.5928 58.497 46.4605C57.7689 47.3279 57.882 48.6216 58.7498 49.3496Z"
              fill="#00565B"
            />
            <path
              d="M83.3173 52.2496L86.7734 49.3495C87.6411 48.6215 87.7542 47.3279 87.0262 46.4604C86.2983 45.5928 85.0045 45.4796 84.137 46.2076L80.6809 49.1077C79.8131 49.8357 79.7001 51.1293 80.4281 51.9968C81.154 52.8618 82.4472 52.9797 83.3173 52.2496Z"
              fill="#00565B"
            />
            <path
              d="M64.5586 89.3555H52.2539C51.1213 89.3555 50.2031 90.2737 50.2031 91.4062V99.6094C50.2031 100.742 51.1213 101.66 52.2539 101.66H64.5586C65.6912 101.66 66.6094 100.742 66.6094 99.6094V91.4062C66.6094 90.2737 65.6912 89.3555 64.5586 89.3555ZM62.5078 97.5586H54.3047V93.457H62.5078V97.5586Z"
              fill="#00565B"
            />
          </svg>
          <p className="mb-4 text-[1.75rem] font-bold text-dark">Welcome!</p>
          <p className="mb-5 font-medium text-center text-darkgray text-[1rem] leading-tight">
            You do not have any portfolios yet. Create one and start tracking your net worth.
          </p>
          <Button
            type="button"
            secondary
            className="w-56"
            onClick={() => setCreatingPortfolio(true)}
          >
            Create portfolio
          </Button>
        </div>
      );
    }

    if (portfolios && portfolios.length > 0) {
      return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {portfolios.map((portfolio) => (
            <Link href={`/portfolios/${portfolio.id}`} key={portfolio.id}>
              <a>
                <PortfolioSummaryCard portfolio={portfolio} />
              </a>
            </Link>
          ))}
        </div>
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

        <div className="flex items-center justify-between mb-7">
          <h1 className="font-bold text-dark text-[1.75rem]">My Portfolios</h1>
          <div className="w-56">
            <Button type="button" onClick={() => setCreatingPortfolio(true)}>
              Create portfolio
            </Button>
          </div>
        </div>

        {renderContent()}
      </Layout>
    </RequiredLoggedIn>
  );
};

export default PortfolioListPage;
