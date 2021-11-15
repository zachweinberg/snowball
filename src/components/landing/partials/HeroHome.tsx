import React, { useEffect, useState } from 'react';
import Typed, { TypedOptions } from 'typed.js';

function HeroHome() {
  const [videoModalOpen, setVideoModalOpen] = useState<boolean>(false);
  const typingEl = React.useRef<HTMLSpanElement | null>(null);
  const typed = React.useRef<Typed | null>(null);

  useEffect(() => {
    const options: TypedOptions = {
      strings: [
        'Stocks',
        'Crypto',
        'Real estate',
        'Bogleheads',
        'Long term',
        'Traders',
        'Gold bugs',
      ],
      loop: true,
      typeSpeed: 50,
      backSpeed: 25,
    };

    typed.current = new Typed(typingEl.current!, options);

    return () => {
      typed.current!.destroy();
    };
  }, []);

  return (
    <>
      <section className="w-full">
        <div>
          <div className="pt-32 pb-12 md:pt-40 md:pb-20 bg-lightlime">
            <div className="pb-12 text-center md:pb-24">
              <h1 className="mb-8 text-5xl font-extrabold tracking-tight md:text-6xl leading-tighter">
                The net worth tracker for
                <br />{' '}
                <div className="type-wrap">
                  <span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-evergreen to-darkgray"
                    style={{ whiteSpace: 'pre' }}
                    ref={typingEl}
                  />
                </div>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="mb-8 text-lg text-dark">
                  Track all of your assets in one place with an easy-to-use platform.
                </p>
                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div>
                    <a
                      className="flex font-semibold text-md items-center py-4 px-3 text-white transition-colors rounded-lg bg-dark hover:bg-evergreen"
                      href="/signup"
                    >
                      Get started
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="relative flex justify-center mb-8">
                <div className="flex flex-col justify-center">
                  <img
                    className="mx-auto"
                    src="/img/1.png"
                    alt="Hero"
                    style={{ maxWidth: '1000px' }}
                  />
                </div>
                {/* <button
                className="absolute flex items-center p-4 font-medium transform -translate-y-1/2 bg-white rounded-full shadow-lg top-full group"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setVideoModalOpen(true);
                }}
                aria-controls="modal"
              >
                <svg
                  className="flex-shrink-0 w-6 h-6 text-gray-400 fill-current group-hover:text-blue-600"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0 2C5.373 24 0 18.627 0 12S5.373 0 12 0s12 5.373 12 12-5.373 12-12 12z" />
                  <path d="M10 17l6-5-6-5z" />
                </svg>
                <span className="ml-3">Watch the full video (2 min)</span>
              </button> */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroHome;
