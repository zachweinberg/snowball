const PricingLight: React.FunctionComponent = () => {
  return (
    <div className="relative flex flex-col items-center px-8 py-10 bg-white border rounded-lg shadow-md sm:py-5 text-dark border-gray">
      <div className="relative mt-8 align-center sm:mt-4">
        <span className="text-6xl font-bold leading-none md:text-5xl">Free</span>
      </div>
      <p className="mt-4 text-lg font-bold leading-none sm:mt-2 xl:text-base">
        <strong>forever</strong>
      </p>

      <ul className="self-start mt-10 space-y-4 sm:mt-5 text-dark">
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Create one portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add up to six assets to your watchlist
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Create up to three asset alerts at once
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Stock and crypto market news portal
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add four stocks positions per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add four crypto positions per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add two real estate holdings per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add four cash positions per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-evergreen">
          Add four custom assets per portfolio
        </li>
      </ul>
    </div>
  );
};

const PricingDark: React.FunctionComponent = () => {
  return (
    <div className="relative flex flex-col items-center px-8 py-10 text-white border rounded-bl-lg rounded-br-lg shadow-md sm:py-5 bg-dark border-dark">
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
        <span className="text-6xl font-bold leading-none md:text-5xl">10.00</span>
      </div>
      <p className="mt-4 text-lg font-bold leading-none sm:mt-2 xl:text-base">
        <strong>per month</strong>
      </p>

      <ul className="self-start mt-10 space-y-4 sm:mt-5">
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Create up to four portfolios
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Add up to 30 assets to your watchlist
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Create up to 20 asset alerts at once
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Stock and crypto market news portal
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Add 30 stocks positions per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Add 30 crypto positions per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Add 20 real estate holdings per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Add 30 cash positions per portfolio
        </li>
        <li className="relative pl-4 before:absolute leading-6 before:top-2 before:left-0 before:w-1.5 before:h-1.5 before:rounded before:bg-lime">
          Add 30 custom assets per portfolio
        </li>
      </ul>
    </div>
  );
};

export { PricingDark, PricingLight };
