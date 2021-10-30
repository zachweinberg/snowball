import React, { useEffect, useState } from 'react';

function Header() {
  const [top, setTop] = useState(true);

  // detect whether user has scrolled the page down by 10px
  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top && 'bg-white shadow-lg'
      }`}
    >
      <div className="max-w-6xl px-5 mx-auto sm:px-6">
        <div className="flex items-center justify-between h-10 my-3 md:h-16 md:my-0">
          <img src="/img/logo.png" className="h-4 cursor-pointer hover:opacity-70" />

          <nav>
            <ul className="flex items-center">
              <li className="flex items-center">
                <a
                  href="/login"
                  className="mr-8 font-medium transition-colors duration-150 ease-in-out text-dark hover:text-darkgray"
                >
                  Login
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="/signup"
                  className="mr-4 font-medium transition-colors duration-150 ease-in-out text-dark hover:text-darkgray"
                >
                  <div className="flex items-center p-3 text-white transition-colors rounded-lg bg-dark hover:bg-evergreen">
                    <span>Sign up</span>
                    <svg
                      className="flex-shrink-0 w-3 h-3 ml-2 -mr-1 fill-current"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                        fillRule="nonzero"
                      />
                    </svg>
                  </div>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
