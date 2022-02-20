import { PlanType } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import { trackGoal } from 'fathom-client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import RequiredLoggedIn from '~/components/auth/RequireLoggedIn';
import { PricingDark, PricingLight } from '~/components/landing/Pricing';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';

const Btn = (props) => {
  return (
    <button
      type="submit"
      className="px-4 py-2 font-semibold text-white transition-colors duration-150 rounded-md bg-evergreen hover:bg-opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-evergreen focus:outline-none"
    >
      {props.children}
    </button>
  );
};

const Upgrade: NextPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isPremium = useMemo(() => auth.user?.plan?.type === PlanType.PREMIUM, [auth.user]);
  const cancelled = useMemo(() => router.query && router.query.cancelled, [router.query]);
  const success = useMemo(() => router.query && router.query.success, [router.query]);

  useEffect(() => {
    if (cancelled) {
      trackGoal('CGDQQ6RR', 0);
    }
  }, []);

  const createCheckoutSession = async () => {
    try {
      setLoading(true);
      const session = await API.createCheckoutSession();
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('We hit an issue while trying to redirect to Stripe. Please contact support.');
    }
  };

  const createPortalSession = async () => {
    try {
      setLoading(true);
      const session = await API.createPortalSession();
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('We hit an issue while trying to redirect to Stripe. Please contact support.');
    }
  };

  return (
    <RequiredLoggedIn>
      <Layout title="Upgrade | Obsidian Tracker">
        {success && (
          <div className="flex justify-center w-1/2 p-3 mx-auto mb-8 text-white rounded-md bg-evergreen">
            🎉 Thank you! We hope you enjoy Premium!
          </div>
        )}

        <div className="flex flex-col items-center justify-center mb-10 md:mb-16">
          <h1 className="font-bold text-[1.75rem] mb-4">Upgrade to Premium</h1>
          <p className="text-sm leading-6 text-center">
            Obsidian Tracker Premium is a monthly subscription that gives you access to more
            alerts, more portfolios and more assets.
            <br />
            Cancel at any time.
          </p>
        </div>

        <div
          className={classNames(
            { 'opacity-70': loading },
            'grid grid-cols-1 gap-16 mb-10 md:pl-20 md:pr-20 md:grid-cols-2 relative'
          )}
        >
          {loading && (
            <div className="absolute inset-0 flex justify-center mt-20">
              <Spinner />
            </div>
          )}

          <div>
            <PricingLight />
            <Button type="button" disabled className="mt-2" variant="secondary">
              {isPremium ? 'Free' : 'Your current plan'}
            </Button>
          </div>
          <div>
            <PricingDark />
            <Button
              type="button"
              className="mt-2"
              variant="upgrade"
              onClick={() => {
                if (isPremium) {
                  createPortalSession();
                } else {
                  createCheckoutSession();
                }
              }}
            >
              {isPremium ? 'Cancel Premium' : 'Upgrade'}
            </Button>
          </div>
        </div>
      </Layout>
    </RequiredLoggedIn>
  );
};

export default Upgrade;
