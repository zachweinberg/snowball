import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { PortfolioLogItem } from '@zachweinberg/obsidian-schema';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';

const PortfolioLogsPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState<PortfolioLogItem[]>([]);
  const auth = useAuth();

  const loadPortfolioLogs = async () => {
    setLoading(true);
    try {
      const resp = await API.getPortfolioLogs(router.query.portfolioID as string);
      setLogs(resp.logItems);
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
    loadPortfolioLogs();
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <div className="max-w-md p-8 mx-auto mt-8 bg-white rounded-md">
          <p className="mb-6 text-xl font-medium text-center">{error}</p>
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

    return (
      <>
        <div className="flex items-center">
          <Link href={`/portfolios/${router.query.portfolioID}`}>
            <ArrowCircleLeftIcon className="w-6 h-6 mr-3 cursor-pointer hover:opacity-70" />
          </Link>

          <h1 className="font-bold text-[1.75rem] mr-4">Portfolio History</h1>
        </div>

        <ul className="mt-8 space-y-2">
          {logs.map((log, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-3 bg-white border rounded-md border-bordergray"
            >
              <p>{log.description}</p>
              <p className="text-sm text-darkgray">
                {DateTime.fromMillis(log.createdAt).toFormat('LLL d yyyy, t')}
              </p>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return <Layout title={`History | Obsidian Tracker`}>{renderContent()}</Layout>;
};

export default PortfolioLogsPage;
