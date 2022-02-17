import { ArrowCircleUpIcon } from '@heroicons/react/outline';
import { PlanType, PLAN_LIMITS, PortfolioWithBalances } from '@zachweinberg/obsidian-schema';
import { DateTime } from 'luxon';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import CreatePortfolioForm from '~/components/portfolio-list/CreatePortfolioForm';
import PortfolioSummaryCard from '~/components/portfolio-list/PortfolioSummaryCard';
import Button from '~/components/ui/Button';
import FullScreenModal from '~/components/ui/FullScreenModal';
import Link from '~/components/ui/Link';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';

const timeOfDay = () => {
  const hour = DateTime.local().hour;

  if (hour >= 0 && hour < 12) {
    return 'morning';
  }

  if (hour >= 12 && hour <= 16) {
    return 'afternoon';
  }

  if (hour >= 17) {
    return 'evening';
  }
};

const PortfolioListPage: NextPage = () => {
  const [creatingPortfolio, setCreatingPortfolio] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioWithBalances[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const auth = useAuth();

  const loadPortfolios = async () => {
    setLoading(true);

    try {
      const portfoliosData = await API.getPortfolios();
      if (portfoliosData.portfolios) {
        setPortfolios(portfoliosData.portfolios.reverse());
      }
    } catch (err) {
      setError(
        'Something went wrong loading your portfolio list. Please contact support if this persists.'
      );
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
          <Spinner />
        </div>
      );
    }

    if (portfolios && portfolios.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto mt-32">
          <p className="mb-5 text-[1.5rem] font-bold text-dark">
            Welcome to Obsidian Tracker!
          </p>
          <p className="mb-5 font-medium text-center text-darkgray text-[.9rem] leading-5">
            You do not have any portfolios yet.
            <br />
            Create one and start tracking your net worth.
          </p>
          <Button
            type="button"
            variant="secondary"
            className="w-44"
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
              <PortfolioSummaryCard portfolio={portfolio} />
            </Link>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <RequiredLoggedIn>
      <Layout title="My Portfolios | Obsidian Tracker">
        <FullScreenModal
          isOpen={creatingPortfolio}
          onClose={() => setCreatingPortfolio(false)}
        >
          <div className="max-w-sm mx-auto">
            {portfolios.length >= PLAN_LIMITS.portfolios.free &&
            auth.user?.plan?.type === PlanType.FREE ? (
              <div className="p-5 text-left border rounded-md border-bordergray">
                <div className="flex justify-center">
                  <ArrowCircleUpIcon className="w-12 h-12 mb-6 text-evergreen" />
                </div>

                <p className="mb-6 font-medium leading-5 text-center text-md text-darkgray">
                  Users on the free plan can create one portfolio. If you would like to create
                  up to four portfolios, please upgrade to the premium plan.
                </p>
                <Link href="/upgrade">
                  <Button variant="primary" type="button">
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            ) : (
              <CreatePortfolioForm
                afterCreate={() => {
                  loadPortfolios();
                  setCreatingPortfolio(false);
                }}
              />
            )}
          </div>
        </FullScreenModal>

        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="font-bold text-dark text-[1.75rem] mb-4">My Portfolios</h1>

            {portfolios.length > 0 && (
              <h2 className="font-normal text-dark text-[1rem] leading-5">
                Good {timeOfDay()} {auth.user?.name}, view your portfolios below:
              </h2>
            )}
          </div>
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
