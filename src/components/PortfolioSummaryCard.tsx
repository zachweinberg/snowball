import { TrendingUpIcon } from '@heroicons/react/solid';
import SmallChart from '~/components/SmallChart';

interface Props {
  portfolioName: string;
  isPublic: boolean;
}

const PortfolioSummaryCard: React.FunctionComponent<Props> = ({
  portfolioName,
  isPublic,
}: Props) => {
  return (
    <div className="flex-1 p-6 overflow-hidden transition-colors bg-white shadow cursor-pointer sm:rounded-lg hover:bg-blue0">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center">
            <p className="text-lg font-bold">{portfolioName}</p>
            {isPublic && (
              <div className="px-3 py-1 ml-3 text-xs font-medium rounded-full bg-gray6 text-purple2">
                Public
              </div>
            )}
          </div>
          <div className="flex items-center text-green2">
            <div className="text-xl font-bold">$313,572</div>
            <div className="flex">
              <div className="mx-3 text-sm">+21.01%</div>
              <div className="self-end">
                <TrendingUpIcon className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <div className="self-end">
          <SmallChart />
        </div>
      </div>

      <div className="grid grid-flow-row grid-cols-3 grid-rows-2 gap-4 mt-4 color">
        <div>
          <div className="text-base font-light portfolio-color">Stocks</div>
          <div className="mt-1 text-xl font-medium tracking-wide">$98,468</div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Cryptocurrency</div>
          <div className="mt-1 text-xl font-medium tracking-wide">$29,467</div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Real Estate</div>
          <div className="mt-1 text-xl font-medium tracking-wide">$138,497</div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Cash</div>
          <div className="mt-1 text-xl font-medium tracking-wide">$7,948</div>
        </div>
        <div>
          <div className="text-base font-light portfolio-color">Custom Assets</div>
          <div className="mt-1 text-xl font-medium tracking-wide">$12,835</div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
