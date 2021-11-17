import { ChevronDownIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from '~/components/ui/Link';
import Menu from '~/components/ui/Menu';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';

const profileLinks = [
  { label: 'Account', href: '/account' },
  { label: 'Settings', href: '/settings' },
];

const Header: React.FunctionComponent = () => {
  const auth = useAuth();
  const router = useRouter();
  const [resentEmail, setResentEmail] = useState(false);

  const links: Array<{ label: string; href: string }> = auth.user
    ? [
        { label: 'Portfolios', href: '/portfolios' },
        { label: 'Watchlist', href: '/watchlist' },
        { label: 'Alerts', href: '/alerts' },
        { label: 'News', href: '/news' },
      ]
    : [
        { label: 'Login', href: '/login' },
        { label: 'Sign up', href: '/signup' },
      ];

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

      <header className="bg-white border-b border-bordergray">
        <div className="flex items-center justify-between px-4 mx-auto max-w-7xl">
          <Link href="/portfolios">
            <img
              src="/img/logo.png"
              className="h-4 hidden md:block transition-opacity cursor-pointer hover:opacity-70"
            />
          </Link>
          <div>
            <nav className="flex items-center">
              <ul className="flex space-x-9 mr-9">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>
                      <div
                        className={classNames(
                          'py-5 font-semibold text-[.95rem]',
                          router.pathname.includes(link.href)
                            ? 'border-lime text-dark border-b-4'
                            : 'text-darkgray hover:text-dark transition-colors'
                        )}
                      >
                        {link.label}
                      </div>
                    </Link>
                  </li>
                ))}
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
