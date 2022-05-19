import { MenuIcon, XIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import Container from '~/components/landing/Container';
import Link from '~/components/ui/Link';
import Logo from '~/components/ui/Logo';

interface Props {
  dark?: boolean;
}

const LandingHeader: React.FunctionComponent<Props> = ({ dark }: Props) => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const maybeCloseSidebar = (event) => {
      const clickedOnSidebar = sidebarRef.current && sidebarRef.current.contains(event.target);

      if (!clickedOnSidebar && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('click', maybeCloseSidebar);
    return () => window.removeEventListener('click', maybeCloseSidebar);
  }, [sidebarOpen]);

  return (
    <>
      <header className={classNames(dark ? 'bg-dark text-white' : 'bg-white text-dark')}>
        <Container>
          <div className="flex items-center justify-between py-5">
            <Link href="/">
              <Logo dark={!dark} />
            </Link>

            <div>
              <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
                <MenuIcon className="w-8 h-8 text-white" />
              </button>

              <nav className="hidden md:items-center md:flex">
                <ul className="flex items-center space-x-9">
                  <li>
                    <Link href="/login">
                      <div className="py-5 font-medium text-[1rem] hover:opacity-80">
                        Log in
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signup">
                      <div className="p-3 font-medium text-[1rem] bg-white rounded-md text-dark hover:bg-lime transition-colors">
                        Sign up
                      </div>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </Container>
      </header>

      <div
        ref={sidebarRef}
        className={classNames(
          'border-l shadow-xl border-gray fixed top-0 right-0 z-50 w-2/5 h-screen transition-transform duration-300 bg-white md:hidden',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="relative px-10 py-20">
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <XIcon className="absolute top-0 right-0 mx-5 my-4 w-7 h-7 text-dark" />
          </button>
          <nav>
            <ul className="space-y-8 font-medium">
              <li>
                <Link href="/login">Login</Link>
              </li>

              <li>
                <Link href="/signup">Sign up</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default LandingHeader;
