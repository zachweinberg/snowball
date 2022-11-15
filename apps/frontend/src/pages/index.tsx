import { trackGoal } from 'fathom-client';
import Head from 'next/head';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import CashIcon from '~/components/icons/CashIcon';
import CryptoIcon from '~/components/icons/CryptoIcon';
import CustomAssetIcon from '~/components/icons/CustomAssetIcon';
import RealEstateIcon from '~/components/icons/RealEstateIcon';
import StockIcon from '~/components/icons/StockIcon';
import Container from '~/components/landing/Container';
import H2 from '~/components/landing/H2';
import LandingFooter from '~/components/landing/LandingFooter';
import LandingHeader from '~/components/landing/LandingHeader';
import { PricingDark, PricingLight } from '~/components/landing/Pricing';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';

const Landing: React.FunctionComponent = () => {
  return (
    <RequiredLoggedOut>
      <Head>
        <title>Snowball - Track all of your financial assets in one place</title>
      </Head>

      <LandingHeader dark />

      <main>
        <div className="pt-16 pb-32 bg-dark">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl font-semibold leading-tight text-white lg:leading-tight lg:text-5xl mb-7">
                Track all of your assets in one place and watch your portfolio grow
              </h1>

              <p className="text-[1rem] lg:text-[1.18rem] text-darkgray mb-7 leading-7">
                Say goodbye to those spreadsheets. Snowball is a net worth tracker that allows
                you to view all of your financial assets in one place. Track your portfolio,
                get price alerts and keep a pulse on the market.
              </p>

              <div className="w-56 mx-auto mb-20">
                <Link href="/signup">
                  <Button
                    type="button"
                    variant="white"
                    className="mt-6"
                    onClick={() => trackGoal('ISXTDA9H', 0)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex justify-center">
              <img src="/img/landing/ui.png" className="rounded-md" />
            </div>
          </Container>
        </div>

        <div className="py-20 text-center border-b border-gray">
          <Container>
            <H2>Snowball lets you tracks everything in one place.</H2>

            <p className="mt-12 leading-6 text-md md:text-lg">
              Add a variety of asset classes to your portfolios and track them over time.
              <br />
              Throw those spreadsheets away, you'll no longer need them.
            </p>

            <div className="grid h-full grid-cols-2 gap-12 mt-12 md:grid-cols-5">
              <div className="flex flex-col items-center justify-center">
                <StockIcon width={75} />
                <p className="mt-2 text-lg">Stocks</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <CryptoIcon width={75} />
                <p className="mt-2 text-lg">Crypto</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <CashIcon width={75} />
                <p className="mt-2 text-lg">Cash</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <RealEstateIcon width={75} />
                <p className="mt-2 text-lg">Real Estate</p>
              </div>
              <div className="flex flex-col items-center justify-center col-span-2 md:col-span-1">
                <CustomAssetIcon width={75} />
                <p className="mt-2 text-lg">Custom Assets</p>
              </div>
            </div>
          </Container>
        </div>

        <div className="pt-40 pb-16 text-center text-white bg-dark">
          <Container>
            <div className="grid grid-cols-1 gap-10 text-center md:text-left md:grid-cols-2 md:gap-16 mb-44">
              <img src="/img/landing/alerts.png" className="w-11/12 mx-auto rounded-md" />

              <div className="flex flex-col justify-center">
                <H2 dark>Set custom price alerts for stocks and crypto</H2>
                <p className="mt-5 leading-7 text-darkgray text-[1.2rem]">
                  Never miss a trade again. We'll notify you via email or SMS when a price
                  alert gets triggered.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 text-center md:text-left md:grid-cols-2 mb-44">
              <div className="flex flex-col justify-center">
                <H2 dark>Import cash and stocks automatically</H2>
                <p className="mt-5 leading-7 text-darkgray text-[1.2rem]">
                  We'll do our best to keep your assets up to date. Or you can manually add
                  your assets.
                </p>
              </div>
              <img src="/img/landing/cash.png" className="w-11/12 mx-auto rounded-md" />
            </div>
          </Container>
        </div>

        <div className="py-20">
          <Container>
            <div className="mb-32 text-center">
              <h1 className="text-4xl font-semibold leading-tight lg:text-[2.85rem] mb-7">
                Pricing
              </h1>

              <p className="max-w-lg mx-auto mb-3 text-lg">
                Unlock premium features with a monthly subscription and access more portfolio
                tracking and alerting features. Cancel at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 grid-rows-2 gap-20 mx-auto md:grid-cols-2 md:grid-rows-1 md:gap-x-8 xl:gap-x-7">
              <PricingLight />
              <PricingDark />
            </div>
          </Container>
        </div>

        <div className="w-56 mx-auto mb-20">
          <p className="mb-2 text-xl font-semibold text-center">Ready to get started?</p>
          <Link href="/signup">
            <Button type="button" className="mt-6" onClick={() => trackGoal('ISXTDA9H', 0)}>
              Create Account
            </Button>
          </Link>
        </div>
      </main>

      <LandingFooter />
    </RequiredLoggedOut>
  );
};

export default Landing;
