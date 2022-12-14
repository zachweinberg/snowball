import { ArrowCircleLeftIcon } from '@heroicons/react/outline';
import { trackGoal } from 'fathom-client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  AssetType,
  EditPortfolioSettingsRequest,
  Period,
  Portfolio,
  PortfolioSettings,
} from 'schema';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import Layout from '~/components/layout/Layout';
import ConfirmModal from '~/components/modals/ConfirmModal';
import Button from '~/components/ui/Button';
import Checkbox from '~/components/ui/Checkbox';
import Link from '~/components/ui/Link';
import Select from '~/components/ui/Select';
import Spinner from '~/components/ui/Spinner';
import TextInput from '~/components/ui/TextInput';
import { useConfirm } from '~/hooks/useConfirm';
import { API } from '~/lib/api';

const PortfolioSettingsPageContent: React.FunctionComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<PortfolioSettings | null>(null);
  const [error, setError] = useState('');
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [newName, setNewName] = useState('');
  const [success, setSuccess] = useState(false);
  const { openConfirm, confirmModalProps } = useConfirm();

  const loadPortfolioSettings = async (showSpinner: boolean = true) => {
    if (showSpinner) {
      setLoading(true);
    }

    try {
      const portfolioData = await API.getPortfolioSettings(router.query.portfolioID as string);
      setPortfolio(portfolioData.portfolio);
      setSettings(portfolioData.portfolio.settings);
      setNewName(portfolioData.portfolio.name);
      setLoading(false);
    } catch (err) {
      if (err.response.status === 404) {
        router.push('/portfolios');
      } else {
        setError(
          'Something went wrong while loading this page. Please contact support if this persists.'
        );
        setLoading(false);
      }
    }
  };

  const deletePortfolio = async () => {
    const confirm = await openConfirm({
      description:
        'Are you sure you want to delete this portfolio? All history and positions will be permanently erased.',
    });

    if (confirm) {
      setLoading(true);
      await API.deletePortfolio(router.query.portfolioID as string);
      router.push('/portfolios');
    }
  };

  const updatePortfolioSettings = async (e) => {
    e.preventDefault();

    if (!settings) {
      return window.confirm('Could not update portfolio settings.');
    }

    setSuccess(false);

    const updateBody: EditPortfolioSettingsRequest = {
      name: newName,
      settings,
    };

    await API.editPortfolioSettings(router.query.portfolioID as string, updateBody);
    setSuccess(true);
    trackGoal('2WJZ8YC2', 0);
    loadPortfolioSettings(false);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    loadPortfolioSettings();
  }, []);

  const renderContent = () => {
    if (error) {
      return (
        <div className="max-w-md p-8 mx-auto bg-white rounded-md">
          <p className="mb-6 text-xl font-medium text-center">{error}</p>
          <Link href="/portfolios">
            <Button type="button">Go Back</Button>
          </Link>
        </div>
      );
    }

    return (
      <Layout title={`${portfolio?.name ?? 'Portfolio'} Settings | Snowball`}>
        <ConfirmModal {...confirmModalProps} />

        {loading ? (
          <div className="flex items-center justify-center mt-32">
            <Spinner />
          </div>
        ) : (
          settings && (
            <>
              <div className="flex items-center mb-7">
                <Link href={`/portfolios/${router.query.portfolioID}`}>
                  <ArrowCircleLeftIcon className="w-6 h-6 mr-3 cursor-pointer hover:opacity-70" />
                </Link>
                <h1 className="font-bold text-[1.75rem]">{portfolio?.name ?? ''}</h1>
              </div>
              <div className="max-w-2xl mb-20">
                {success && (
                  <div className="px-3 py-5 mb-5 font-medium text-white rounded-md bg-evergreen">
                    Portfolio settings successfully saved!
                  </div>
                )}

                <form
                  autoComplete="off"
                  className="pb-16 border-b border-gray"
                  onSubmit={updatePortfolioSettings}
                >
                  <div className="mb-8">
                    <h1 className="mb-2 text-xl font-medium leading-6 text-dark">
                      Portfolio Settings
                    </h1>
                    <p className="mt-1 text-[1.1rem] text-darkgray">
                      Customize this portfolio's settings below
                    </p>
                  </div>

                  <div className="mb-8">
                    <label className="block mb-1 text-sm font-medium text-dark">
                      Portfolio Name
                    </label>
                    <div className="mt-1">
                      <TextInput
                        placeholder="Enter portfolio name"
                        type="text"
                        name="newName"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                    </div>
                  </div>

                  <label className="block mb-1 text-sm font-medium text-dark">
                    Portfolio Privacy Level
                  </label>
                  <div className="mb-8 bg-white border-2 rounded-md border-gray">
                    <div
                      className="flex items-center justify-start px-4 py-5 text-left border-b cursor-pointer border-gray"
                      onClick={() => setSettings({ ...settings, private: true })}
                    >
                      <Checkbox
                        onChange={(checked) => {}}
                        name="private"
                        title="Private Portfolio"
                        description="Only you will be able to view this portfolio. Even if someone has the link, they will not be able to view the portfolio.  Nobody except you will be able to modify assets or edit the portfolio."
                        checked={settings.private === true}
                      />
                    </div>

                    <div
                      className="flex items-center justify-start px-4 py-5 text-left cursor-pointer"
                      onClick={() => setSettings({ ...settings, private: false })}
                    >
                      <Checkbox
                        onChange={(checked) => {}}
                        name="public"
                        title="Public Portfolio"
                        description="Anyone with the link will be able to view this portfolio and assets. Nobody except you will be able to modify assets or edit the portfolio."
                        checked={settings.private === false}
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-medium text-dark">
                      Default Asset Type
                    </label>
                    <p className="mb-1 text-sm font-medium text-darkgray">
                      Which asset type would you like to display first when you view your
                      portfolio?
                    </p>

                    <div className="w-64">
                      <Select
                        selected={settings.defaultAssetType}
                        onChange={(assetType) =>
                          setSettings({
                            ...settings,
                            defaultAssetType: assetType as AssetType,
                          })
                        }
                        options={[
                          { label: 'Stocks', value: AssetType.Stock },
                          { label: 'Crypto', value: AssetType.Crypto },
                          { label: 'Real Estate', value: AssetType.RealEstate },
                          { label: 'Cash', value: AssetType.Cash },
                          { label: 'Custom Assets', value: AssetType.Custom },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="mb-10">
                    <label className="block text-sm font-medium text-dark">
                      Summary Emails
                    </label>
                    <p className="mb-1 text-sm font-medium text-darkgray">
                      How often would you like us to send you an email summarizing this
                      portfolio's net worth?
                    </p>

                    <div className="w-64">
                      <Select
                        selected={settings.summaryEmailPeriod}
                        onChange={(period) =>
                          setSettings({
                            ...settings,
                            summaryEmailPeriod: period as Period,
                          })
                        }
                        options={[
                          { label: 'Daily', value: Period.Daily },
                          { label: 'Weekly', value: Period.Weekly },
                          { label: 'Monthly', value: Period.Monthly },
                          { label: 'Never', value: Period.Never },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <Button type="submit" className="w-48">
                      Save Settings
                    </Button>
                  </div>
                </form>

                <div className="flex justify-start py-16">
                  <button
                    type="submit"
                    onClick={deletePortfolio}
                    className="px-4 py-3 font-semibold text-white transition-colors duration-150 rounded-md bg-red hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-evergreen focus:outline-none"
                  >
                    Delete Portfolio
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </Layout>
    );
  };

  return <RequiredLoggedIn>{renderContent()}</RequiredLoggedIn>;
};

const PortfolioSettingsPage: NextPage = () => {
  return (
    <RequiredLoggedIn>
      <PortfolioSettingsPageContent />
    </RequiredLoggedIn>
  );
};

export default PortfolioSettingsPage;
