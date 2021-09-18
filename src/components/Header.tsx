import { ChevronDownIcon } from '@heroicons/react/outline';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import Cloud from '~/components/Cloud';
import Link from '~/components/Link';
import Typography from '~/components/Typography';
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
      <div className="max-w-6xl px-4 flex justify-between items-center mx-auto py-2">
        <div>
          <Cloud width={35} />
        </div>
        <div>
          <nav className="flex items-center">
            <ul className="flex space-x-9 mr-9">
              {links.map((link) => (
                <li>
                  <Link href={link.href}>
                    <Typography
                      element="div"
                      variant="Link"
                      className={classNames(
                        'py-5',
                        router.pathname === link.href
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
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-dark mr-1">
              <span className="text-lg font-medium leading-none text-white">Z</span>
            </span>
            <ChevronDownIcon className="h-5 w-5 text-dark" />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
