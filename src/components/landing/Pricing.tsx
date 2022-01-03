const PricingLight: React.FunctionComponent = () => {
  return (
    <div className="relative flex flex-col items-center px-8 py-10 bg-white border rounded-lg sm:py-5 text-dark border-gray">
      <div className="relative mt-8 align-center sm:mt-4">
        <span className="font-bold leading-none text-8xl md:text-5xl">Free</span>
      </div>
      <p className="mt-4 text-lg font-bold leading-none sm:mt-2 xl:text-base">
        <strong>forever</strong>
      </p>

      <ul className="self-start mt-10 space-y-4 sm:mt-5 text-dark">
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Create one portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add 5 of each asset class to your portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add 3 assets to your watchlist
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Create 2 asset alerts
        </li>
      </ul>
    </div>
  );
};

const PricingDark: React.FunctionComponent = () => {
  return (
    <div className="relative flex flex-col items-center px-8 py-10 text-white border rounded-bl-lg rounded-br-lg sm:py-5 bg-dark border-dark">
      <span
        className="absolute top-0 flex items-center justify-center h-10 text-sm font-black tracking-wide uppercase -translate-y-full rounded-t rounded-tl-lg rounded-tr-lg -left-px -right-px text-dark"
        style={{
          background: 'linear-gradient(269.58deg, #00565B 0%, #F5FDD8 100%)',
        }}
      >
        Premium
      </span>

      <div className="relative mt-8 align-center sm:mt-4">
        <span className="absolute text-2xl font-semibold top-2 -left-5 md:text-xl md:top-1 md:-left-4">
          $
        </span>
        <span className="font-bold leading-none text-8xl md:text-5xl">9.99</span>
      </div>
      <p className="mt-4 text-lg font-bold leading-none sm:mt-2 xl:text-base">
        <strong>per month</strong>
      </p>

      <ul className="self-start mt-10 space-y-4 sm:mt-5">
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Your first 6 hours are free
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          No credit card required
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          No maximum API calls
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Pay only for what you use
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Billed by the second, prepaid
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Up to 1,000 running browsers
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Email support
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Puppeteer, selenium and more
        </li>
      </ul>
    </div>
  );
};

export { PricingDark, PricingLight };
