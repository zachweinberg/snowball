import { useEffect } from 'react';
import ReactTypingEffect from 'react-typing-effect';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Link from '~/components/ui/Link';
import Logo from '~/components/ui/Logo';

// Track all of your assets in one place and monitor your portfolio over time.

// Create price alerts for stocks and crypto to get notified via text or email

// Keep a pulse on the markets with a live feed of news

const Home: React.FunctionComponent = () => {
  useEffect(() => {
    if (document) {
      document.querySelector('html')!.style.scrollBehavior = 'auto';
      window.scroll({ top: 0 });
      document.querySelector('html')!.style.scrollBehavior = '';
    }
  }, []);

  return (
    <RequiredLoggedOut>
      <div className="landing">
        <header className="bg-white ud-absolute ud-top-0 ud-left-0 ud-z-40 ud-w-full ud-flex ud-items-center ud-transition py-4">
          <div className="ud-container">
            <div className="ud-flex ud-mx-[-16px] ud-items-center ud-justify-between ud-relative">
              <div className="ud-px-4 ud-w-60 ud-max-w-full">
                <Link href="/">
                  <Logo width={160} />
                </Link>
              </div>

              <div className="ud-flex ud-px-4 ud-justify-between ud-items-center">
                <div className="sm:ud-flex ud-justify-end ud-hidden ud-pr-16 lg:ud-pr-0">
                  <Link
                    href="/login"
                    className="ud-text-base ud-font-semibold opacity-50 hover:text-evergreen hover:opacity-100 ud-py-3 ud-px-7 ud-transition"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="
                  ud-text-base
                  ud-font-bold
                  ud-text-white
                  bg-dark
                  ud-py-3
                  ud-px-8
                  md:ud-px-9
                  lg:ud-px-8
                  xl:ud-px-9
                  hover:opacity-80
                  ud-rounded-lg ud-transition ud-ease-in-out ud-duration-300
                "
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>
        <section
          id="home"
          className="
        ud-relative ud-overflow-hidden ud-z-10 ud-pt-[120px] ud-pb-16
        md:ud-pt-[150px]
        xl:ud-pt-[180px]
      "
        >
          <div className="ud-container">
            <div className="ud-flex ud-flex-wrap ud-mx-[-16px]">
              <div className="ud-w-full ud-px-4">
                <div
                  className="ud-mx-auto ud-max-w-[720px] ud-text-center wow fadeInUp"
                  data-wow-delay=".2s"
                >
                  <h1
                    className="
                  ud-text-black ud-font-bold ud-text-3xl
                  sm:ud-text-4xl
                  md:ud-text-5xl
                  ud-leading-tight
                  sm:ud-leading-tight
                  md:ud-leading-tight
                  ud-mb-5
                "
                  >
                    <div className="flex">
                      <span className="mr-4">Track all of your</span>
                      <span>
                        <ReactTypingEffect
                          text={['Stocks', 'Crypto', 'Cash', 'Real estate']}
                          speed={80}
                          eraseSpeed={80}
                          typingDelay={0}
                          eraseDelay={400}
                          className="text-transparent bg-clip-text bg-gradient-to-r to-lime from-evergreen"
                          cursorClassName="text-dark"
                        />
                      </span>
                    </div>
                    <div>in one place.</div>
                  </h1>
                  <p className="ud-font-medium ud-text-lg md:ud-text-xl ud-leading-relaxed md:ud-leading-relaxed ud-text-body-color ud-opacity-90 ud-mb-12">
                    Obsidian Tracker is a net worth tracker that allows you to keep track of
                    your stocks, crypto, cash, real estate and more in one simple place.
                  </p>
                  <div className="ud-flex ud-items-center ud-justify-center">
                    <Link
                      href="/signup"
                      className="
                    menu-scroll
                    ud-text-base
                    ud-font-semibold
                    ud-text-white
                    bg-dark
                    ud-py-4
                    ud-px-7
                    ud-mx-2
                    ud-rounded-lg
                    ud-transition
                    ud-ease-in-out
                    ud-duration-300
                    hover:opacity-80
                  "
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
                <div className="ud-text-center">
                  <div
                    className="
                  ud-mx-auto ud-mt-10
                  lg:ud-mt-14
                  ud-relative ud-z-20
                  fadeInUp
                  ud-inline-block ud-bg-white ud-shadow-image
                "
                    data-wow-delay=".2s"
                  >
                    <img
                      src="img/landing/ui.png"
                      alt="image"
                      className="ud-max-w-full ud-mx-auto"
                    />
                    <div
                      className="
                    ud-absolute ud-right-[-16px] ud-bottom-[-16px] ud-z-[-1]
                  "
                    >
                      <svg
                        width="98"
                        height="98"
                        viewBox="0 0 98 98"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M49 98C76.0572 98 98 76.0618 98 49C98 21.9382 76.0572 0 49 0C21.9428 0 0 21.9382 0 49C0 76.0618 21.9428 98 49 98Z"
                          fill="url(#paint0_radial_77:31)"
                        />
                        <defs>
                          <radialGradient
                            id="paint0_radial_77:31"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(49) rotate(90) scale(98)"
                          >
                            <stop stopColor="white" />
                            <stop offset="0.569" stopColor="#F0F4FD" />
                            <stop offset="0.993" stopColor="#D9E0F0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ud-absolute ud-right-0 ud-top-24 ud-z-[-1]">
            <svg
              width="111"
              height="176"
              viewBox="0 0 111 176"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M87.9999 176C136.614 176 176 136.602 176 88C176 39.3978 136.614 0 87.9999 0C39.4096 0 -0.00012207 39.3978 -0.00012207 88C-0.00012207 136.602 39.4096 176 87.9999 176Z"
                fill="url(#paint0_radial_2:29)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_2:29"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(87.9999) rotate(90) scale(176)"
                >
                  <stop stopColor="white" />
                  <stop offset="0.569" stopColor="#F0F4FD" />
                  <stop offset="0.993" stopColor="#D9E0F0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </section>
        <section id="about" className="ud-pt-[100px]">
          <div className="ud-container">
            <div className="ud-flex ud-flex-wrap ud-mx-[-16px]">
              <div className="ud-w-full ud-px-4">
                <div
                  className="
                ud-mx-auto ud-max-w-[655px] ud-text-center ud-mb-12
                wow
                fadeInUp
              "
                  data-wow-delay=".1s"
                >
                  <span
                    className="
                  ud-text-lg ud-font-semibold text-evergreen ud-mb-2 ud-block
                "
                  >
                    Know About Our Product
                  </span>
                  <h2
                    className="
                  ud-text-black ud-font-bold ud-text-3xl
                  sm:ud-text-4xl
                  md:ud-text-[45px]
                  ud-mb-5
                "
                  >
                    About Our Software
                  </h2>
                  <p
                    className="
                  ud-text-body-color ud-text-base
                  md:ud-text-lg
                  ud-leading-relaxed
                  md:ud-leading-relaxed
                  ud-max-w-[570px] ud-mx-auto
                "
                  >
                    There are many variations of passages of Lorem Ipsum available but the
                    majority have suffered alteration in some form.
                  </p>
                </div>
              </div>
            </div>

            <div className="ud-flex ud-flex-wrap ud-justify-center ud-mx-[-16px]">
              <div className="ud-w-full ud-px-4">
                <div className="ud-flex ud-justify-center">
                  <div
                    className="
                  ud-inline-flex
                  ud-flex-wrap
                  ud-justify-center
                  ud-items-center
                  ud-bg-white
                  ud-shadow-md
                  ud-rounded-sm
                  ud-py-2
                  ud-mb-[60px]
                  tabButtons
                "
                  >
                    <div
                      className="
                    ud-flex ud-items-center ud-text-body-color
                    hover:ud-text-primary
                    ud-text-base
                    md:ud-text-lg
                    ud-px-4
                    md:ud-px-6
                    ud-my-2
                    ud-border-r
                    ud-border-body-color
                    ud-border-opacity-30
                  "
                    >
                      <span className="ud-mr-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            opacity="0.5"
                            cx="4.11765"
                            cy="4.11814"
                            r="4.11765"
                            fill="#00565B"
                          />
                          <circle cx="15.8824" cy="4.11814" r="4.11765" fill="#00565B" />
                          <circle
                            opacity="0.5"
                            cx="15.8824"
                            cy="15.8828"
                            r="4.11765"
                            fill="#00565B"
                          />
                          <circle cx="4.11765" cy="15.8828" r="4.11765" fill="#00565B" />
                        </svg>
                      </span>
                      Stocks
                    </div>
                    <div
                      className="
                    ud-flex ud-items-center ud-text-body-color
                    hover:ud-text-primary
                    ud-text-base
                    md:ud-text-lg
                    ud-px-4
                    md:ud-px-6
                    ud-my-2
                    ud-border-r
                    ud-border-body-color
                    ud-border-opacity-30
                  "
                    >
                      <span className="ud-mr-3">
                        <svg
                          width="32"
                          height="20"
                          viewBox="0 0 32 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle opacity="0.5" cx="22" cy="10.0005" r="10" fill="#00565B" />
                          <path
                            d="M22 10.0005L12 17.0005L12 3.00049L22 10.0005Z"
                            fill="#00565B"
                          />
                          <rect y="9.00049" width="12" height="2" fill="#00565B" />
                        </svg>
                      </span>
                      Crypto
                    </div>
                    <div
                      className="
                    ud-flex ud-items-center ud-text-body-color
                    hover:ud-text-primary
                    ud-text-base
                    md:ud-text-lg
                    ud-px-4
                    md:ud-px-6
                    ud-my-2
                    ud-border-r
                    ud-border-body-color
                    ud-border-opacity-30
                  "
                    >
                      <span className="ud-mr-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 11.563V20.0005L19.9994 14.2192V5.78174L10 11.563Z"
                            fill="#00565B"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M0 14.3755L10 20.0005V11.563L0 5.78174V14.3755Z"
                            fill="#00565B"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 8.12549L0 14.3755L10 20.0005L20 14.3755L10 8.12549Z"
                            fill="url(#paint0_linear_3:20)"
                            fillOpacity="0.64"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10 0.000488281L0 5.78174L10 11.563L20 5.78174L10 0.000488281Z"
                            fill="url(#paint1_linear_3:20)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_3:20"
                              x1="-3.86893e-09"
                              y1="11.9781"
                              x2="19.8302"
                              y2="17.6066"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" stopOpacity="0.299" />
                              <stop offset="1" stopColor="#7587E4" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient
                              id="paint1_linear_3:20"
                              x1="3.7182"
                              y1="0.000488354"
                              x2="11.1258"
                              y2="15.7396"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#7587E4" />
                              <stop offset="1" stopColor="#CCD4FF" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      Cash
                    </div>
                    <div
                      className="
                    ud-flex ud-items-center ud-text-body-color
                    hover:ud-text-primary
                    ud-text-base
                    md:ud-text-lg
                    ud-px-4
                    md:ud-px-6
                    ud-my-2
                  "
                    >
                      <span className="ud-mr-3">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.5"
                            d="M20 5.71484V20.0006H5.71429V15.9189H15.9184V5.71484H20Z"
                            fill="#00565B"
                          />
                          <rect
                            y="0.000488281"
                            width="14.2857"
                            height="14.2857"
                            fill="#00565B"
                          />
                        </svg>
                      </span>
                      Real Estate
                    </div>
                  </div>
                </div>

                <div className="ud-text-center">
                  <div className="ud-mx-auto ud-bg-white ud-shadow-image">
                    <img src="img/landing/list.png" alt="image" className="w-1/2 ud-mx-auto" />
                  </div>
                  <div className="ud-mx-auto ud-bg-white ud-shadow-image">
                    <img
                      src="img/landing/watchlist.png"
                      alt="image"
                      className="ud-max-w-full ud-mx-auto"
                    />
                  </div>
                  <div className="ud-mx-auto ud-bg-white ud-shadow-image">
                    <img
                      src="img/landing/news.png"
                      alt="image"
                      className="ud-max-w-full ud-mx-auto"
                    />
                  </div>
                  <div className="ud-mx-auto ud-bg-white ud-shadow-image">
                    <img
                      src="images/hero/hero-image.png"
                      alt="image"
                      className="ud-max-w-full ud-mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="ud-pt-[100px]">
          <div className="ud-container">
            <div className="ud-flex ud-flex-wrap ud-mx-[-16px]">
              <div className="ud-w-full ud-px-4">
                <div
                  className="
                ud-mx-auto ud-max-w-[655px] ud-text-center ud-mb-20
                wow
                fadeInUp
              "
                  data-wow-delay=".1s"
                >
                  <span
                    className="
                  ud-text-lg ud-font-semibold ud-text-primary ud-mb-2 ud-block
                "
                  >
                    Our Software's Core Features
                  </span>
                  <h2
                    className="
                  ud-text-black ud-font-bold ud-text-3xl
                  sm:ud-text-4xl
                  md:ud-text-[45px]
                  ud-mb-5
                "
                  >
                    SaaS Features
                  </h2>
                  <p
                    className="
                  ud-text-body-color ud-text-base
                  md:ud-text-lg
                  ud-leading-relaxed
                  md:ud-leading-relaxed
                  ud-max-w-[570px] ud-mx-auto
                "
                  >
                    There are many variations of passages of Lorem Ipsum available but the
                    majority have suffered alteration in some form.
                  </p>
                </div>
              </div>
            </div>

            <div className="ud-pb-12 ud-border-b ud-border-[#E9ECF8]">
              <div className="ud-flex ud-flex-wrap ud-mx-[-16px]">
                <div className="ud-w-full md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                  <div
                    className="ud-mb-[70px] ud-text-center 2xl:ud-px-5 wow fadeInUp"
                    data-wow-delay=".15s"
                  >
                    <div className="ud-mb-9 ud-flex ud-justify-center">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M27.2727 0.000488281V15.9096H34.0909L25 27.2732L15.9091 15.9096H22.7273V0.000488281H27.2727Z"
                          fill="#00565B"
                        />
                        <path
                          d="M43.1818 0.000488281H34.0909V4.54594H43.1818C43.7846 4.54594 44.3627 4.78539 44.7889 5.21161C45.2151 5.63783 45.4545 6.21591 45.4545 6.81867V31.8187H31.8182V38.6369H18.1818V31.8187H4.54545V6.81867C4.54545 6.21591 4.7849 5.63783 5.21112 5.21161C5.63734 4.78539 6.21542 4.54594 6.81818 4.54594H15.9091V0.000488281H6.81818C5.00989 0.000488281 3.27566 0.71883 1.997 1.99749C0.718341 3.27614 0 5.01038 0 6.81867V43.1823C0 44.9906 0.718341 46.7248 1.997 48.0035C3.27566 49.2821 5.00989 50.0005 6.81818 50.0005H43.1818C44.9901 50.0005 46.7243 49.2821 48.003 48.0035C49.2817 46.7248 50 44.9906 50 43.1823V6.81867C50 5.01038 49.2817 3.27614 48.003 1.99749C46.7243 0.71883 44.9901 0.000488281 43.1818 0.000488281Z"
                          fill="#00565B"
                        />
                      </svg>
                    </div>
                    <h3
                      className="
                    ud-font-bold ud-text-black ud-text-xl
                    sm:ud-text-2xl
                    lg:ud-text-xl
                    xl:ud-text-2xl
                    ud-mb-5
                  "
                    >
                      SaaS Focused
                    </h3>
                    <p className="ud-text-body-color ud-text-base ud-leading-relaxed">
                      Deleniti nemo temporibus minima iusto, voluptatem sint ratione eveniet
                      maiores nihil maxime repellendus, dolorum dolorem atque delectus laborum.
                    </p>
                  </div>
                </div>
                <div className="ud-w-full md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                  <div
                    className="ud-mb-[70px] ud-text-center 2xl:ud-px-5 wow fadeInUp"
                    data-wow-delay=".15s"
                  >
                    <div className="ud-mb-9 ud-flex ud-justify-center">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.5265 0.000488281H2.11742C0.948003 0.000488281 0 0.948491 0 2.11791V33.8793C0 35.0487 0.948003 35.9967 2.11742 35.9967H27.5265C28.6959 35.9967 29.6439 35.0487 29.6439 33.8793V2.11791C29.6439 0.948491 28.6959 0.000488281 27.5265 0.000488281Z"
                          fill="#00565B"
                        />
                        <path
                          opacity="0.5"
                          d="M48.4022 15.1783L34.5141 11.4199L33.4088 15.5087L45.2663 18.7145L38.0692 45.2839L13.541 38.6542L12.4378 42.743L39.0115 49.9274C39.2799 49.9998 39.5601 50.0187 39.8358 49.9829C40.1116 49.9471 40.3776 49.8573 40.6186 49.7187C40.8597 49.5801 41.0711 49.3953 41.2407 49.175C41.4104 48.9547 41.535 48.7031 41.6074 48.4346L49.8929 17.7743C50.0393 17.2324 49.9645 16.6545 49.685 16.1677C49.4054 15.681 48.9441 15.3251 48.4022 15.1783Z"
                          fill="#00565B"
                        />
                      </svg>
                    </div>
                    <h3
                      className="
                    ud-font-bold ud-text-black ud-text-xl
                    sm:ud-text-2xl
                    lg:ud-text-xl
                    xl:ud-text-2xl
                    ud-mb-5
                  "
                    >
                      Developer Friendly
                    </h3>
                    <p className="ud-text-body-color ud-text-base ud-leading-relaxed">
                      Deleniti nemo temporibus minima iusto, voluptatem sint ratione eveniet
                      maiores nihil maxime repellendus, dolorum dolorem atque delectus laborum.
                    </p>
                  </div>
                </div>
                <div className="ud-w-full md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                  <div
                    className="ud-mb-[70px] ud-text-center 2xl:ud-px-5 wow fadeInUp"
                    data-wow-delay=".2s"
                  >
                    <div className="ud-mb-9 ud-flex ud-justify-center">
                      <svg
                        width="50"
                        height="50"
                        viewBox="0 0 50 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.1818 20.455H2.27273C1.66996 20.455 1.09188 20.2156 0.665665 19.7894C0.239446 19.3631 0 18.7851 0 18.1823V2.27322C0 1.67045 0.239446 1.09237 0.665665 0.666153C1.09188 0.239934 1.66996 0.000488281 2.27273 0.000488281H18.1818C18.7846 0.000488281 19.3627 0.239934 19.7889 0.666153C20.2151 1.09237 20.4545 1.67045 20.4545 2.27322V18.1823C20.4545 18.7851 20.2151 19.3631 19.7889 19.7894C19.3627 20.2156 18.7846 20.455 18.1818 20.455Z"
                          fill="#00565B"
                        />
                        <path
                          d="M18.1818 50.0004H2.27273C1.66996 50.0004 1.09188 49.761 0.665665 49.3348C0.239446 48.9086 0 48.3305 0 47.7277V31.8186C0 31.2159 0.239446 30.6378 0.665665 30.2116C1.09188 29.7853 1.66996 29.5459 2.27273 29.5459H18.1818C18.7846 29.5459 19.3627 29.7853 19.7889 30.2116C20.2151 30.6378 20.4545 31.2159 20.4545 31.8186V47.7277C20.4545 48.3305 20.2151 48.9086 19.7889 49.3348C19.3627 49.761 18.7846 50.0004 18.1818 50.0004Z"
                          fill="#00565B"
                        />
                        <path
                          opacity="0.5"
                          d="M27.2727 2.27319H50V6.81865H27.2727V2.27319ZM27.2727 13.6368H50V18.1823H27.2727V13.6368ZM27.2727 31.8186H50V36.3641H27.2727V31.8186ZM27.2727 43.1823H50V47.7277H27.2727V43.1823Z"
                          fill="#00565B"
                        />
                      </svg>
                    </div>
                    <h3
                      className="
                    ud-font-bold ud-text-black ud-text-xl
                    sm:ud-text-2xl
                    lg:ud-text-xl
                    xl:ud-text-2xl
                    ud-mb-5
                  "
                    >
                      Essential Components
                    </h3>
                    <p className="ud-text-body-color ud-text-base ud-leading-relaxed">
                      Deleniti nemo temporibus minima iusto, voluptatem sint ratione eveniet
                      maiores nihil maxime repellendus, dolorum dolorem atque delectus laborum.
                    </p>
                  </div>
                </div>
                <div className="ud-w-full md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                  <div
                    className="ud-mb-[70px] ud-text-center 2xl:ud-px-5 wow fadeInUp"
                    data-wow-delay=".15s"
                  >
                    <div className="ud-mb-9 ud-flex ud-justify-center">
                      <svg
                        width="46"
                        height="50"
                        viewBox="0 0 46 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M43.75 6.25049H25V10.4172H43.75C44.3025 10.4172 44.8324 10.1977 45.2231 9.80696C45.6138 9.41626 45.8333 8.88636 45.8333 8.33382C45.8333 7.78129 45.6138 7.25138 45.2231 6.86068C44.8324 6.46998 44.3025 6.25049 43.75 6.25049Z"
                          fill="#00565B"
                        />
                        <path
                          d="M2.08333 10.4172H12.5V16.6672H20.8333V0.000488281H12.5V6.25049H2.08333C1.5308 6.25049 1.00089 6.46998 0.610193 6.86068C0.219492 7.25138 0 7.78129 0 8.33382C0 8.88636 0.219492 9.41626 0.610193 9.80696C1.00089 10.1977 1.5308 10.4172 2.08333 10.4172Z"
                          fill="#00565B"
                        />
                        <path
                          d="M43.75 39.5839H25V43.7505H43.75C44.3025 43.7505 44.8324 43.531 45.2231 43.1403C45.6138 42.7496 45.8333 42.2197 45.8333 41.6672C45.8333 41.1147 45.6138 40.5848 45.2231 40.1941C44.8324 39.8034 44.3025 39.5839 43.75 39.5839Z"
                          fill="#00565B"
                        />
                        <path
                          d="M2.08333 43.7505H12.5V50.0005H20.8333V33.3339H12.5V39.5839H2.08333C1.5308 39.5839 1.00089 39.8034 0.610193 40.1941C0.219492 40.5848 0 41.1147 0 41.6672C0 42.2197 0.219492 42.7496 0.610193 43.1403C1.00089 43.531 1.5308 43.7505 2.08333 43.7505Z"
                          fill="#00565B"
                        />
                        <path
                          opacity="0.5"
                          d="M43.75 22.9171H37.5V27.0838H43.75C44.3025 27.0838 44.8324 26.8643 45.2231 26.4736C45.6138 26.0829 45.8333 25.553 45.8333 25.0004C45.8333 24.4479 45.6138 23.918 45.2231 23.5273C44.8324 23.1366 44.3025 22.9171 43.75 22.9171ZM2.08333 27.0838H25V33.3338H33.3333V16.6671H25V22.9171H2.08333C1.5308 22.9171 1.00089 23.1366 0.610193 23.5273C0.219492 23.918 0 24.4479 0 25.0004C0 25.553 0.219492 26.0829 0.610193 26.4736C1.00089 26.8643 1.5308 27.0838 2.08333 27.0838Z"
                          fill="#00565B"
                        />
                      </svg>
                    </div>
                    <h3
                      className="
                    ud-font-bold ud-text-black ud-text-xl
                    sm:ud-text-2xl
                    lg:ud-text-xl
                    xl:ud-text-2xl
                    ud-mb-5
                  "
                    >
                      Easy to Customize
                    </h3>
                    <p className="ud-text-body-color ud-text-base ud-leading-relaxed">
                      Deleniti nemo temporibus minima iusto, voluptatem sint ratione eveniet
                      maiores nihil maxime repellendus, dolorum dolorem atque delectus laborum.
                    </p>
                  </div>
                </div>
                <div className="ud-w-full md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                  <div
                    className="ud-mb-[70px] ud-text-center 2xl:ud-px-5 wow fadeInUp"
                    data-wow-delay=".15s"
                  >
                    <div className="ud-mb-9 ud-flex ud-justify-center">
                      <svg
                        width="40"
                        height="50"
                        viewBox="0 0 40 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M39.8228 2.21287C39.8228 0.88544 38.9379 0.000488281 37.6104 0.000488281H2.87607L28.7609 14.1597V37.6109H37.6104C38.9379 37.6109 39.8228 36.726 39.8228 35.3986V2.21287Z"
                          fill="#00565B"
                        />
                        <path
                          d="M24.3362 16.8148L0 3.54053V35.3988C0 36.2837 0.442476 36.9475 1.10619 37.3899L24.3362 50.0005V16.8148Z"
                          fill="#00565B"
                        />
                      </svg>
                    </div>
                    <h3
                      className="
                    ud-font-bold ud-text-black ud-text-xl
                    sm:ud-text-2xl
                    lg:ud-text-xl
                    xl:ud-text-2xl
                    ud-mb-5
                  "
                    >
                      High-quality Design
                    </h3>
                    <p className="ud-text-body-color ud-text-base ud-leading-relaxed">
                      Deleniti nemo temporibus minima iusto, voluptatem sint ratione eveniet
                      maiores nihil maxime repellendus, dolorum dolorem atque delectus laborum.
                    </p>
                  </div>
                </div>
                <div className="ud-w-full md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                  <div
                    className="ud-mb-[70px] ud-text-center 2xl:ud-px-5 wow fadeInUp"
                    data-wow-delay=".2s"
                  >
                    <div className="ud-mb-9 ud-flex ud-justify-center">
                      <svg
                        width="46"
                        height="50"
                        viewBox="0 0 46 50"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M35.7142 42.8576C32.4285 42.8576 29.7618 40.191 29.7618 36.9053C29.7618 36.0793 29.923 35.2891 30.2299 34.5658C30.3139 34.3676 30.2782 34.136 30.1261 33.9838L28.2169 32.0746C27.9938 31.8515 27.6217 31.8881 27.4637 32.1613C26.6592 33.5524 26.1904 35.1726 26.1904 36.9053C26.1904 42.1672 30.4523 46.4291 35.7142 46.4291V48.7934C35.7142 49.2388 36.2528 49.4619 36.5678 49.1469L40.7178 44.9969C40.9131 44.8016 40.9131 44.4851 40.7178 44.2898L36.5678 40.1398C36.2528 39.8248 35.7142 40.0479 35.7142 40.4933V42.8576ZM35.7142 27.3815V25.0172C35.7142 24.5717 35.1756 24.3486 34.8607 24.6636L30.7106 28.8136C30.5154 29.0089 30.5154 29.3255 30.7106 29.5207L34.8607 33.6708C35.1756 33.9857 35.7142 33.7627 35.7142 33.3172V30.9529C38.9999 30.9529 41.6666 33.6196 41.6666 36.9053C41.6666 37.7313 41.5054 38.5215 41.1985 39.2448C41.1145 39.4429 41.1502 39.6746 41.3024 39.8268L43.2115 41.7359C43.4346 41.959 43.8067 41.9224 43.9647 41.6493C44.7692 40.2581 45.238 38.638 45.238 36.9053C45.238 31.6434 40.9761 27.3815 35.7142 27.3815Z"
                          fill="#00565B"
                        />
                        <path
                          d="M21.4285 36.9052C21.4285 40.2265 22.4724 43.2906 24.2586 45.8081C24.7693 46.5279 24.2883 47.6194 23.4058 47.6194H4.76189C2.11904 47.6194 0 45.5004 0 42.8575V4.76238C0 2.14334 2.11904 0.000488281 4.76189 0.000488281H7.14284H19.0476H33.3333C35.9523 0.000488281 38.0951 2.11953 38.0951 4.76238V20.306C38.0951 20.9267 37.5253 21.429 36.9047 21.429C28.3571 21.429 21.4285 28.3576 21.4285 36.9052Z"
                          fill="#00565B"
                        />
                      </svg>
                    </div>
                    <h3
                      className="
                    ud-font-bold ud-text-black ud-text-xl
                    sm:ud-text-2xl
                    lg:ud-text-xl
                    xl:ud-text-2xl
                    ud-mb-5
                  "
                    >
                      Regular Updates
                    </h3>
                    <p className="ud-text-body-color ud-text-base ud-leading-relaxed">
                      Deleniti nemo temporibus minima iusto, voluptatem sint ratione eveniet
                      maiores nihil maxime repellendus, dolorum dolorem atque delectus laborum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="ud-pt-[120px] ud-pb-20">
          <div className="ud-container">
            <div className="ud-flex ud-flex-wrap ud-mx-[-16px]">
              <div className="ud-w-full ud-px-4">
                <div
                  className="
                ud-mx-auto ud-max-w-[655px] ud-text-center ud-mb-20
                wow
                fadeInUp
              "
                  data-wow-delay=".1s"
                >
                  <span
                    className="
                  ud-text-lg ud-font-semibold ud-text-primary ud-mb-2 ud-block
                "
                  >
                    Affordable Pricing
                  </span>
                  <h2
                    className="
                  ud-text-black ud-font-bold ud-text-3xl
                  sm:ud-text-4xl
                  md:ud-text-[45px]
                  ud-mb-5
                "
                  >
                    Our Pricing Plans
                  </h2>
                  <p
                    className="
                  ud-text-body-color ud-text-base
                  md:ud-text-lg
                  ud-leading-relaxed
                  md:ud-leading-relaxed
                  ud-max-w-[570px] ud-mx-auto
                "
                  >
                    There are many variations of passages of Lorem Ipsum available but the
                    majority have suffered alteration in some form.
                  </p>
                </div>
              </div>
            </div>

            <div className="ud-flex ud-flex-wrap ud-justify-center ud-mx-[-16px]">
              <div className="ud-w-full sm:ud-w-3/4 md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                <div
                  className="
                ud-bg-white ud-shadow-pricing ud-p-10
                md:ud-px-8
                lg:ud-py-10 lg:ud-px-6
                xl:ud-p-10
                ud-text-center ud-rounded-sm ud-relative ud-z-10 ud-mb-10
              "
                >
                  <div className="ud-flex ud-justify-center ud-items-end">
                    <h2 className="ud-font-bold ud-text-black ud-text-[42px] ud-mb-2">
                      Free
                      <span className="ud-text-lg ud-font-medium ud-text-body-color">
                        {' '}
                        forever
                      </span>
                    </h2>
                  </div>
                  <p
                    className="
                  ud-text-base
                  ud-text-body-color
                  ud-leading-relaxed
                  ud-font-medium
                  ud-pb-9
                  xl:ud-pb-9
                  lg:ud-pb-6
                  ud-mb-9
                  lg:ud-mb-6
                  xl:ud-mb-9
                  ud-border-b ud-border-[#E9ECF8]
                "
                  >
                    Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim.
                  </p>
                  <div className="ud-mb-8">
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      All UI Components
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Use with Unlimited Projects
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Commercial Use
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Email Support
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Lifetime Access
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Free Lifetime Updates
                    </p>
                  </div>
                  <div
                    className="
                  ud-flex
                  ud-items-center
                  ud-justify-center
                  ud-p-3
                  ud-rounded-sm
                  bg-dark
                  ud-text-semibold
                  ud-text-base
                  ud-text-white
                  hover:ud-shadow-signUp
                  ud-transition ud-duration-300 ud-ease-in-out
                "
                  >
                    Get Started
                  </div>

                  <div className="ud-absolute ud-right-0 ud-top-0 ud-z-[-1]">
                    <svg
                      width="37"
                      height="154"
                      viewBox="0 0 37 154"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.1"
                        x="17.5237"
                        y="78.0005"
                        width="24.7822"
                        height="24.7822"
                        rx="4"
                        transform="rotate(45 17.5237 78.0005)"
                        fill="#00565B"
                      />
                      <rect
                        opacity="0.3"
                        x="47.585"
                        y="92.9392"
                        width="41.1567"
                        height="45.1468"
                        rx="5"
                        transform="rotate(45 47.585 92.9392)"
                        fill="#00565B"
                      />
                      <rect
                        opacity="0.8"
                        x="57.7432"
                        y="-2.99951"
                        width="78.8328"
                        height="78.8328"
                        rx="10"
                        transform="rotate(45 57.7432 -2.99951)"
                        fill="#00565B"
                      />
                    </svg>
                  </div>
                  <div className="ud-absolute ud-left-0 ud-bottom-0 ud-z-[-1]">
                    <svg
                      width="229"
                      height="182"
                      viewBox="0 0 229 182"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.05"
                        x="-0.639709"
                        y="21.1696"
                        width="46.669"
                        height="45.7644"
                        rx="10"
                        transform="rotate(45 -0.639709 21.1696)"
                        fill="url(#paint0_linear_25:114)"
                      />
                      <rect
                        opacity="0.05"
                        x="40.1691"
                        y="0.000488281"
                        width="34.3355"
                        height="33.67"
                        rx="5"
                        transform="rotate(45 40.1691 0.000488281)"
                        fill="url(#paint1_linear_25:114)"
                      />
                      <rect
                        opacity="0.07"
                        x="60.9458"
                        y="42.1696"
                        width="237"
                        height="380.347"
                        rx="22"
                        transform="rotate(45 60.9458 42.1696)"
                        fill="url(#paint2_linear_25:114)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_25:114"
                          x1="29.5176"
                          y1="14.0581"
                          x2="14.35"
                          y2="82.5021"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#00565B" />
                          <stop offset="0.822917" stopColor="#00565B" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_25:114"
                          x1="62.3565"
                          y1="-5.23156"
                          x2="51.1974"
                          y2="45.1244"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#00565B" />
                          <stop offset="0.822917" stopColor="#00565B" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_25:114"
                          x1="214.094"
                          y1="-16.9334"
                          x2="120.415"
                          y2="348.232"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#00565B" />
                          <stop offset="0.822917" stopColor="#00565B" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="ud-w-full sm:ud-w-3/4 md:ud-w-1/2 lg:ud-w-1/3 ud-px-4">
                <div
                  className="
                ud-bg-white ud-shadow-pricing ud-p-10
                md:ud-px-8
                lg:ud-py-10 lg:ud-px-6
                xl:ud-p-10
                ud-text-center ud-rounded-sm ud-relative ud-z-10 ud-mb-10
              "
                >
                  <div className="ud-flex ud-justify-center ud-items-end">
                    <h2 className="ud-font-bold ud-text-black ud-text-[42px] ud-mb-2">
                      $4.99
                      <span className="ud-text-lg ud-font-medium ud-text-body-color">
                        /month
                      </span>
                    </h2>
                  </div>
                  <p
                    className="
                  ud-text-base
                  ud-text-body-color
                  ud-leading-relaxed
                  ud-font-medium
                  ud-pb-9
                  xl:ud-pb-9
                  lg:ud-pb-6
                  ud-mb-9
                  lg:ud-mb-6
                  xl:ud-mb-9
                  ud-border-b ud-border-[#E9ECF8]
                "
                  >
                    Lorem ipsum dolor sit amet adiscing elit Mauris egestas enim.
                  </p>
                  <div className="ud-mb-8">
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      All UI Components
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Use with Unlimited Projects
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Commercial Use
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Email Support
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Lifetime Access
                    </p>
                    <p className="ud-font-medium ud-text-base ud-text-body-color ud-mb-3">
                      Free Lifetime Updates
                    </p>
                  </div>
                  <div
                    className="
                  ud-flex
                  ud-items-center
                  ud-justify-center
                  ud-p-3
                  ud-rounded-sm
                  bg-dark
                  ud-text-semibold
                  ud-text-base
                  ud-text-white
                  hover:ud-shadow-signUp
                  ud-transition ud-duration-300 ud-ease-in-out
                "
                  >
                    Get Started
                  </div>

                  <div className="ud-absolute ud-right-0 ud-top-0 ud-z-[-1]">
                    <svg
                      width="37"
                      height="154"
                      viewBox="0 0 37 154"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.1"
                        x="17.5237"
                        y="78.0005"
                        width="24.7822"
                        height="24.7822"
                        rx="4"
                        transform="rotate(45 17.5237 78.0005)"
                        fill="#00565B"
                      />
                      <rect
                        opacity="0.3"
                        x="47.585"
                        y="92.9392"
                        width="41.1567"
                        height="45.1468"
                        rx="5"
                        transform="rotate(45 47.585 92.9392)"
                        fill="#00565B"
                      />
                      <rect
                        opacity="0.8"
                        x="57.7432"
                        y="-2.99951"
                        width="78.8328"
                        height="78.8328"
                        rx="10"
                        transform="rotate(45 57.7432 -2.99951)"
                        fill="#00565B"
                      />
                    </svg>
                  </div>
                  <div className="ud-absolute ud-left-0 ud-bottom-0 ud-z-[-1]">
                    <svg
                      width="229"
                      height="182"
                      viewBox="0 0 229 182"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        opacity="0.05"
                        x="-0.639709"
                        y="21.1696"
                        width="46.669"
                        height="45.7644"
                        rx="10"
                        transform="rotate(45 -0.639709 21.1696)"
                        fill="url(#paint0_linear_25:114)"
                      />
                      <rect
                        opacity="0.05"
                        x="40.1691"
                        y="0.000488281"
                        width="34.3355"
                        height="33.67"
                        rx="5"
                        transform="rotate(45 40.1691 0.000488281)"
                        fill="url(#paint1_linear_25:114)"
                      />
                      <rect
                        opacity="0.07"
                        x="60.9458"
                        y="42.1696"
                        width="237"
                        height="380.347"
                        rx="22"
                        transform="rotate(45 60.9458 42.1696)"
                        fill="url(#paint2_linear_25:114)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_25:114"
                          x1="29.5176"
                          y1="14.0581"
                          x2="14.35"
                          y2="82.5021"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#00565B" />
                          <stop offset="0.822917" stopColor="#00565B" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_25:114"
                          x1="62.3565"
                          y1="-5.23156"
                          x2="51.1974"
                          y2="45.1244"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#00565B" />
                          <stop offset="0.822917" stopColor="#00565B" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient
                          id="paint2_linear_25:114"
                          x1="214.094"
                          y1="-16.9334"
                          x2="120.415"
                          y2="348.232"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#00565B" />
                          <stop offset="0.822917" stopColor="#00565B" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="ud-pt-20 ud-pb-12">
          <div className="ud-container">
            <div className="ud-flex ud-flex-wrap ud-mx-[-16px]">
              <div className="ud-w-full lg:ud-w-4/12 2xl:ud-w-5/12 ud-px-4">
                <div className="ud-mb-6">
                  <Link href="/" className="ud-inline-block ud-mb-5">
                    <Logo width={100} />
                  </Link>
                  <p className="ud-text-base ud-text-body-color ud-font-medium">
                    &copy; {new Date().getFullYear()} ZJW LLC.
                  </p>
                </div>
              </div>
              <div className="ud-w-full md:ud-w-8/12 lg:ud-w-5/12 2xl:ud-w-5/12 ud-px-4">
                <div className="ud-mb-6 ud-mt-4">
                  <div className="ud-flex ud-flex-wrap ud-items-center">
                    <Link
                      href="/contact"
                      className="
                    ud-text-base ud-text-body-color
                    hover:ud-text-primary
                    ud-font-medium ud-mr-8
                  "
                    >
                      Contact
                    </Link>

                    <a
                      href="/"
                      className="
                    ud-text-base ud-text-body-color
                    hover:ud-text-primary
                    ud-font-medium
                  "
                    >
                      Support
                    </a>
                  </div>
                </div>
              </div>
              <div className="ud-w-full md:ud-w-4/12 lg:ud-w-3/12 2xl:ud-w-2/12 ud-px-4">
                <div className="ud-mb-6 ud-mt-4 md:ud-text-right">
                  <h3 className="ud-font-medium ud-text-black ud-text-xl ud-mb-4">
                    Follow Us
                  </h3>
                  <div className="ud-flex ud-flex-wrap md:ud-justify-end ud-items-center">
                    <a href="/" className="ud-text-body-color hover:ud-text-primary">
                      <svg
                        width="9"
                        height="18"
                        viewBox="0 0 9 18"
                        className="ud-fill-current"
                      >
                        <path d="M8.13643 7.00049H6.78036H6.29605V6.43597V4.68597V4.12146H6.78036H7.79741C8.06378 4.12146 8.28172 3.89565 8.28172 3.55694V0.565004C8.28172 0.254521 8.088 0.000488281 7.79741 0.000488281H6.02968C4.11665 0.000488281 2.78479 1.58113 2.78479 3.92388V6.37952V6.94404H2.30048H0.65382C0.314802 6.94404 0 7.25452 0 7.70613V9.73839C0 10.1336 0.266371 10.5005 0.65382 10.5005H2.25205H2.73636V11.065V16.7384C2.73636 17.1336 3.00273 17.5005 3.39018 17.5005H5.66644C5.81174 17.5005 5.93281 17.4158 6.02968 17.3029C6.12654 17.19 6.19919 16.9924 6.19919 16.8231V11.0932V10.5287H6.70771H7.79741C8.11222 10.5287 8.35437 10.3029 8.4028 9.9642V9.93597V9.90775L8.74182 7.96017C8.76604 7.76258 8.74182 7.53678 8.59653 7.31097C8.54809 7.16984 8.33016 7.02871 8.13643 7.00049Z" />
                      </svg>
                    </a>
                    <a href="/" className="ud-text-body-color hover:ud-text-primary ud-ml-6">
                      <svg
                        width="19"
                        height="14"
                        viewBox="0 0 19 14"
                        className="ud-fill-current"
                      >
                        <path d="M16.3024 2.26076L17.375 1.02789C17.6855 0.693982 17.7702 0.437132 17.7984 0.308707C16.9516 0.771036 16.1613 0.925146 15.6532 0.925146H15.4556L15.3427 0.822406C14.6653 0.283022 13.8185 0.000488281 12.9153 0.000488281C10.9395 0.000488281 9.3871 1.49021 9.3871 3.2111C9.3871 3.31384 9.3871 3.46795 9.41532 3.57069L9.5 4.08439L8.90726 4.05871C5.29435 3.95597 2.33065 1.13063 1.85081 0.642612C1.06048 1.92686 1.5121 3.15973 1.99194 3.93028L2.95161 5.36864L1.42742 4.59809C1.45565 5.67686 1.90726 6.52446 2.78226 7.1409L3.54435 7.6546L2.78226 7.93713C3.2621 9.24706 4.33468 9.78645 5.125 9.99193L6.16935 10.2488L5.18145 10.8652C3.60081 11.8926 1.625 11.8156 0.75 11.7385C2.52823 12.8686 4.64516 13.1255 6.1129 13.1255C7.21371 13.1255 8.03226 13.0227 8.22984 12.9457C16.1331 11.2505 16.5 4.82926 16.5 3.54501V3.36521L16.6694 3.26248C17.629 2.44056 18.0242 2.00391 18.25 1.74706C18.1653 1.77275 18.0524 1.82412 17.9395 1.8498L16.3024 2.26076Z" />
                      </svg>
                    </a>
                    <a href="/" className="ud-text-body-color hover:ud-text-primary ud-ml-6">
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        className="ud-fill-current"
                      >
                        <path d="M17.5058 2.07168C17.3068 1.24929 16.7099 0.609661 15.9423 0.396451C14.5778 0.000488354 9.0627 0.000488281 9.0627 0.000488281C9.0627 0.000488281 3.54766 0.000488354 2.18311 0.396451C1.41555 0.609661 0.818561 1.24929 0.619565 2.07168C0.25 3.56415 0.25 6.61002 0.25 6.61002C0.25 6.61002 0.25 9.68634 0.619565 11.1484C0.818561 11.9707 1.41555 12.6104 2.18311 12.8236C3.54766 13.2195 9.0627 13.2195 9.0627 13.2195C9.0627 13.2195 14.5778 13.2195 15.9423 12.8236C16.7099 12.6104 17.3068 11.9707 17.5058 11.1484C17.8754 9.68634 17.8754 6.61002 17.8754 6.61002C17.8754 6.61002 17.8754 3.56415 17.5058 2.07168ZM7.30016 9.44267V3.77736L11.8771 6.61002L7.30016 9.44267Z" />
                      </svg>
                    </a>
                    <a href="/" className="ud-text-body-color hover:ud-text-primary ud-ml-6">
                      <svg
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        className="ud-fill-current"
                      >
                        <path d="M15.2196 0.000488281H1.99991C1.37516 0.000488281 0.875366 0.49798 0.875366 1.11984V14.3034C0.875366 14.9004 1.37516 15.4227 1.99991 15.4227H15.1696C15.7943 15.4227 16.2941 14.9252 16.2941 14.3034V1.09497C16.3441 0.49798 15.8443 0.000488281 15.2196 0.000488281ZM5.44852 13.1094H3.17444V5.77139H5.44852V13.1094ZM4.29899 4.75153C3.54929 4.75153 2.97452 4.15454 2.97452 3.43318C2.97452 2.71182 3.57428 2.11483 4.29899 2.11483C5.02369 2.11483 5.62345 2.71182 5.62345 3.43318C5.62345 4.15454 5.07367 4.75153 4.29899 4.75153ZM14.07 13.1094H11.796V9.55232C11.796 8.70659 11.771 7.58723 10.5964 7.58723C9.39693 7.58723 9.222 8.53246 9.222 9.4777V13.1094H6.94792V5.77139H9.17202V6.79124H9.19701C9.52188 6.19425 10.2466 5.59727 11.3711 5.59727C13.6952 5.59727 14.12 7.08974 14.12 9.12945V13.1094H14.07Z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </RequiredLoggedOut>
  );
};

export default Home;
