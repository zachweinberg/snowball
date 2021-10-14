import { RadioGroup } from '@headlessui/react';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { Portfolio, PortfolioSettings } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';
import Spinner from '~/components/ui/Spinner';
import { API } from '~/lib/api';

const PRIVACY_LEVELS = [
  {
    value: 'Public Portfolio',
    description:
      'Anyone with the link to this portfolio can view it. Only you can modify the portfolio.',
  },
  {
    name: 'Private Portfolio',
    description: 'Only you can view this portfolio. Only you can modify the portfolio.',
  },
];

const PortfolioSettingsPage: NextPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [addingAsset, setAddingAsset] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [error, setError] = useState('');

  const loadPortfolio = async () => {
    setLoading(true);

    try {
      const portfolioData = await API.getPortfolioSettings(router.query.portfolioID as string);
      setPortfolio(portfolioData.portfolio);
      setSettings(portfolioData.portfolio.settings);
    } catch (err) {
      if (err.response.status === 404) {
        router.push('/portfolios');
      } else {
        setError(
          'Something went wrong while loading this page. Please contact support if this persists.'
        );
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

    return (
      <Layout title={`${portfolio?.name ?? 'Portfolio'} Settings - Obsidian Tracker`}>
        {portfolio && settings && (
          <>
            <div className="flex items-center mb-7">
              <Link href={`/portfolios/${portfolio.id}`}>
                <ArrowCircleLeftIcon className="w-8 h-8 mr-3 cursor-pointer hover:opacity-70" />
              </Link>
              <h1 className="font-bold text-[1.75rem]">{portfolio.name}</h1>
            </div>
            <div>
              <form className="max-w-2xl">
                <div className="space-y-6">
                  <div>
                    <h1 className="text-lg font-medium leading-6 text-dark">
                      Portfolio Settings
                    </h1>
                    <p className="mt-1 text-md text-darkgray">
                      Customize this portfolio's settings below:
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="project-name"
                      className="block text-sm font-medium text-dark"
                    >
                      Portfolio Name
                    </label>
                    <div className="mt-1">{/* <TextInput value={portfolio.name} /> */}</div>
                  </div>

                  <RadioGroup value={null} onChange={() => null}>
                    <RadioGroup.Label className="text-sm font-medium text-dark">
                      Privacy
                    </RadioGroup.Label>

                    <div className="mt-1 -space-y-px bg-white rounded-md shadow-sm">
                      {PRIVACY_LEVELS.map((setting, id) => (
                        <RadioGroup.Option
                          key={setting.name}
                          value={setting.name}
                          className={({ checked }) =>
                            classNames(
                              id === 0 ? 'rounded-tl-md rounded-tr-md' : '',
                              id === PRIVACY_LEVELS.length - 1
                                ? 'rounded-bl-md rounded-br-md'
                                : '',
                              checked ? 'bg-sky-50 border-sky-200 z-10' : 'border-gray-200',
                              'relative border p-4 flex cursor-pointer focus:outline-none'
                            )
                          }
                        >
                          {({ active, checked }) => (
                            <>
                              <span
                                className={classNames(
                                  checked
                                    ? 'bg-sky-600 border-transparent'
                                    : 'bg-white border-gray-300',
                                  active ? 'ring-2 ring-offset-2 ring-sky-500' : '',
                                  'h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center'
                                )}
                                aria-hidden="true"
                              >
                                <span className="rounded-full bg-white w-1.5 h-1.5" />
                              </span>
                              <div className="flex flex-col ml-3">
                                <RadioGroup.Label
                                  as="span"
                                  className={classNames(
                                    checked ? 'text-evergreen' : 'text-dark',
                                    'block text-sm font-medium'
                                  )}
                                >
                                  {setting.name}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className={classNames(
                                    checked ? 'text-evergreen' : 'text-dark',
                                    'block text-sm'
                                  )}
                                >
                                  {setting.description}
                                </RadioGroup.Description>
                              </div>
                            </>
                          )}
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm text-dark hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-sky-500 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                    >
                      Create this project
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        )}
      </Layout>
    );
  };

  return <RequiredLoggedIn>{renderContent()}</RequiredLoggedIn>;
};

export default PortfolioSettingsPage;
