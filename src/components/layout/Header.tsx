import { ChevronDownIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Cloud from '~/components/ui/Cloud';
import Dropdown from '~/components/ui/Dropdown';
import Link from '~/components/ui/Link';
import { useAuth } from '~/hooks/useAuth';
import { API } from '~/lib/api';

const profileLinks = [
  { label: 'Account', href: '/account' },
  { label: 'Settings', href: '/settings' },
];

const Header: React.FunctionComponent = () => {
  const auth = useAuth();
  const router = useRouter();

  const links: Array<{ label: string; href: string }> = auth.user
    ? [
        { label: 'Portfolios', href: '/portfolios' },
        { label: 'Watchlist', href: '/watchlist' },
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
          Please verify your email address by clicking the link in the email we've sent you.{' '}
          <span
            onClick={API.resendVerificationEmail}
            className="ml-2 font-semibold underline cursor-pointer hover:text-darkgray"
          >
            Resend email
          </span>
        </div>
      )}
      <header className="bg-white border-b border-bordergray">
        <div className="flex items-center justify-between px-4 mx-auto max-w-7xl">
          <Link href="/portfolios">
            <Cloud width={35} className="hover:opacity-70" />
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
                            : 'text-darkgray hover:text-dark'
                        )}
                      >
                        {link.label}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <Dropdown
                options={[
                  { label: 'Settings', onClick: () => auth.logout() },
                  { label: 'Subscription', onClick: () => auth.logout() },
                  { label: 'Log Out', onClick: () => auth.logout() },
                ]}
                button={() => (
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-dark hover:opacity-90">
                      <span className="text-lg font-medium leading-none text-white">
                        {auth.user?.name?.[0]}
                      </span>
                    </span>
                    <ChevronDownIcon className="w-5 h-5 text-dark" />
                  </div>
                )}
              />

              {/*  */}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
