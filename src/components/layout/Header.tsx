import { ChevronDownIcon } from '@heroicons/react/outline';
import { PlanType } from '@zachweinberg/obsidian-schema';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import Link from '~/components/ui/Link';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import Logo from '../ui/Logo';

interface Props {
  noBorder?: boolean;
}

const Header: React.FunctionComponent<Props> = ({ noBorder }: Props) => {
  const auth = useAuth();
  const router = useRouter();

  const isPremium = useMemo(() => auth.user?.plan?.type === PlanType.PREMIUM, [auth.user]);

  return (
    <header className={classNames('bg-white', { 'border-b border-bordergray': !noBorder })}>
      <div className="flex items-center justify-between px-4 mx-auto md:max-w-7xl">
        <Link
          className="hidden space-x-1 sm:flex sm:items-center"
          href={auth.user ? '/portfolios' : '/'}
        >
          <Logo dark />
          {isPremium && (
            <p className="px-2 py-1 text-xs font-semibold text-evergreen">PREMIUM</p>
          )}
        </Link>
        <div className="w-full">
          <nav className="flex items-center justify-end w-full">
            <ul className="flex space-x-9">
              {auth.user ? (
                <>
                  <li>
                    <Link href="/portfolios">
                      <div
                        className={classNames(
                          'py-5 font-semibold text-xs md:text-[.95rem] border-b-4',
                          router.pathname.includes('portfolios')
                            ? 'border-lime text-dark'
                            : 'text-darkgray border-white hover:text-dark transition-colors'
                        )}
                      >
                        Portfolios
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/alerts">
                      <div
                        className={classNames(
                          'py-5 font-semibold text-xs md:text-[.95rem] border-b-4',
                          router.pathname.includes('alerts')
                            ? 'border-lime text-dark'
                            : 'text-darkgray border-white hover:text-dark transition-colors'
                        )}
                      >
                        Alerts
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/watchlist">
                      <div
                        className={classNames(
                          'py-5 font-semibold text-xs md:text-[.95rem] border-b-4',
                          router.pathname.includes('watchlist')
                            ? 'border-lime text-dark'
                            : 'text-darkgray hover:text-dark border-white transition-colors'
                        )}
                      >
                        Watchlist
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/news">
                      <div
                        className={classNames(
                          'py-5 font-semibold text-xs md:text-[.95rem] border-b-4',
                          router.pathname.includes('news')
                            ? 'border-lime text-dark'
                            : 'text-darkgray border-white hover:text-dark transition-colors'
                        )}
                      >
                        Market News
                      </div>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/login">
                      <div
                        className={classNames(
                          'py-5 font-semibold text-xs md:text-[.95rem] border-b-4',
                          router.pathname.includes('login')
                            ? 'border-lime text-dark'
                            : 'text-darkgray hover:text-dark transition-colors border-transparent'
                        )}
                      >
                        Login
                      </div>
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link href="/signup">
                      <button
                        type="button"
                        className="p-3 text-xs font-semibold text-white md:text-[.95rem] rounded-lg bg-dark hover:text-gray"
                      >
                        Get Started
                      </button>
                    </Link>
                  </li>
                </>
              )}
            </ul>

            {auth.user && (
              <>
                <Menu
                  options={[
                    { label: 'Account', onClick: () => router.push('/account') },
                    { label: 'Log Out', onClick: () => auth.logout() },
                  ]}
                  button={() => (
                    <div className="flex items-center ml-9">
                      <span className="inline-flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-dark hover:opacity-90">
                        <span className="text-lg font-medium leading-none text-white">
                          {auth.user?.name?.[0].toUpperCase()}
                        </span>
                      </span>

                      <ChevronDownIcon className="w-5 h-5 text-dark" />
                    </div>
                  )}
                />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);
