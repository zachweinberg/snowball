import { ChevronDownIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from '~/components/ui/Link';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';
import Logo from '../ui/Logo';

interface Props {
  noBorder?: boolean;
}

const Header: React.FunctionComponent<Props> = ({ noBorder }: Props) => {
  const auth = useAuth();
  const router = useRouter();
  const [resentEmail, setResentEmail] = useState(false);

  return (
    <>
      {auth.user && !auth.user.verified && (
        <div className="w-full p-2 text-sm text-center bg-lime text-dark opacity-70">
          {resentEmail ? (
            <p>Sent!</p>
          ) : (
            <>
              <span>
                Please verify your email address by clicking the link in the email we've sent
                you.
              </span>

              <span
                onClick={async () => {
                  await API.resendVerificationEmail;
                  setResentEmail(true);
                }}
                className="ml-2 font-semibold underline cursor-pointer hover:opacity-75"
              >
                Resend email
              </span>
            </>
          )}
        </div>
      )}

      <header className={classNames('bg-white', { 'border-b border-bordergray': !noBorder })}>
        <div className="flex items-center justify-between px-4 mx-auto max-w-7xl">
          <Link href={auth.user ? '/portfolios' : '/signup'}>
            <Logo width={150} dark />
          </Link>
          <div>
            <nav className="flex items-center">
              <ul className="flex space-x-9 mr-9">
                {auth.user ? (
                  <>
                    <li>
                      <Link href="/portfolios">
                        <div
                          className={classNames(
                            'py-5 font-semibold text-[.95rem]',
                            router.pathname.includes('portfolios')
                              ? 'border-lime text-dark border-b-4'
                              : 'text-darkgray hover:text-dark transition-colors'
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
                            'py-5 font-semibold text-[.95rem]',
                            router.pathname.includes('alerts')
                              ? 'border-lime text-dark border-b-4'
                              : 'text-darkgray hover:text-dark transition-colors'
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
                            'py-5 font-semibold text-[.95rem]',
                            router.pathname.includes('watchlist')
                              ? 'border-lime text-dark border-b-4'
                              : 'text-darkgray hover:text-dark transition-colors'
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
                            'py-5 font-semibold text-[.95rem]',
                            router.pathname.includes('news')
                              ? 'border-lime text-dark border-b-4'
                              : 'text-darkgray hover:text-dark transition-colors'
                          )}
                        >
                          News
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
                            'py-5 font-semibold text-[.95rem] border-b-4',
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
                          className="p-3 rounded-lg font-semibold text-[.95rem] text-white bg-dark hover:text-gray"
                        >
                          Get Started
                        </button>
                      </Link>
                    </li>
                  </>
                )}
              </ul>

              {auth.user && (
                <Menu
                  options={[
                    { label: 'Settings', onClick: () => null },
                    { label: 'Subscription', onClick: () => null },
                    { label: 'Log Out', onClick: () => auth.logout() },
                  ]}
                  button={() => (
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-dark hover:opacity-90">
                        <span className="text-lg font-medium leading-none text-white">
                          {auth.user?.name?.[0].toUpperCase()}
                        </span>
                      </span>
                      <ChevronDownIcon className="w-5 h-5 text-dark" />
                    </div>
                  )}
                />
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
