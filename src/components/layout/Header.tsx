import { ChevronDownIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Cloud from '~/components/ui/Cloud';
import Link from '~/components/ui/Link';
import Typography from '~/components/ui/Typography';
import { useAuth } from '~/hooks/useAuth';

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
    <header className="bg-white">
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
                    <Typography
                      element="div"
                      variant="Link"
                      className={classNames(
                        'py-5',
                        router.pathname.includes(link.href)
                          ? 'border-lime text-dark border-b-4'
                          : 'text-darkgray'
                      )}
                    >
                      {link.label}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
            <span
              className="inline-flex items-center justify-center w-10 h-10 mr-1 rounded-full bg-dark"
              onClick={auth.logout}
            >
              <span className="text-lg font-medium leading-none text-white">Z</span>
            </span>
            <ChevronDownIcon className="w-5 h-5 text-dark" />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
