import { Disclosure, Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import { CloudIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment } from 'react';
import { useAuth } from '~/hooks/useAuth';
import Button from './Button';

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
    <div>
      <Disclosure as="nav">
        {({ open }) => (
          <div className="bg-white border-b border-gray7">
            <div className="max-w-6xl px-4 mx-auto">
              <div className="flex items-center justify-between h-16">
                <div>
                  <Link href="/">
                    <a>
                      <CloudIcon
                        className="w-8 h-8 cursor-pointer text-blue1 hover:opacity-80"
                        aria-hidden="true"
                      />
                    </a>
                  </Link>
                </div>
                {auth.user && (
                  <div className="hidden md:block">
                    <div className="flex items-baseline space-x-4">
                      {links.map((link, i) => (
                        <Link href={link.href} key={i}>
                          <a
                            className={classNames(
                              'px-3 py-2 text-xl font-semibold rounded-md',
                              router.pathname.includes(link.href)
                                ? 'text-blue1'
                                : 'hover:text-blue1 text-blue3'
                            )}
                          >
                            {link.label}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {auth.user && (
                  <div className="hidden md:block">
                    <div className="flex items-center ml-4">
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button className="flex items-center p-1 rounded-full">
                            <div className="flex items-center max-w-xs mr-2 text-sm rounded-full">
                              <div className="flex items-center justify-center w-10 h-10 font-medium text-white rounded-full bg-blue1">
                                ZW
                              </div>
                            </div>
                            <ChevronDownIcon className="w-5 h-5" aria-hidden="true" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-50 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {profileLinks.map((link, i) => (
                              <Menu.Item key={i}>
                                {({ active }) => (
                                  <Link href={link.href}>
                                    <a className="block px-4 py-2 text-sm text-blue3 hover:text-blue1">
                                      {link.label}
                                    </a>
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                            <Menu.Item onClick={() => auth.logout()}>
                              <div className="block px-4 py-2 text-sm cursor-pointer text-blue3 hover:text-blue1">
                                Log Out
                              </div>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                )}
                {!auth.user && (
                  <div className="hidden md:items-center md:flex">
                    <Link href="/login">
                      <a className="font-medium">Login</a>
                    </Link>
                    <Link href="/signup">
                      <a>
                        <Button small type="button" className="ml-4">
                          Sign up
                        </Button>
                      </a>
                    </Link>
                  </div>
                )}
                <div className="flex -mr-2 md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray2 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block w-6 h-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block w-6 h-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {links.map((link, i) => (
                  <Link key={i} href={link.href}>
                    <a
                      className={classNames(
                        'block px-3 py-2 text-base font-semibold rounded-md',
                        router.pathname.includes(link.href)
                          ? 'text-blue1'
                          : 'hover:text-blue1 text-blue3'
                      )}
                    >
                      {link.label}
                    </a>
                  </Link>
                ))}
              </div>
              {auth.user && (
                <div className="pb-3 border-t border-gray7">
                  <div className="px-2 mt-3 space-y-1">
                    {profileLinks.map((link, i) => (
                      <Link key={i} href={link.href}>
                        <a className="block px-3 py-2 text-base font-semibold rounded-md text-blue3 hover:text-blue1">
                          {link.label}
                        </a>
                      </Link>
                    ))}
                    <div
                      className="block px-3 py-2 text-base font-medium rounded-md cursor-pointer text-blue3 hover:text-blue1"
                      onClick={() => auth.logout()}
                    >
                      Log Out
                    </div>
                  </div>
                </div>
              )}
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
};

export default Header;
