import { PortfolioWithBalances } from '@zachweinberg/wealth-schema';
import { formatMoneyFromNumber } from '~/lib/money';
import PercentageCircle from '../ui/PercentageCircle';
import Typography from '../ui/Typography';

interface Props {
  portfolio: PortfolioWithBalances;
}

const PortfolioSummaryCard: React.FunctionComponent<Props> = ({ portfolio }: Props) => {
  return (
    <div className="bg-white shadow-sm hover:shadow-md rounded-3xl p-7">
      <div className="flex justify-between pb-8 border-b border-bordergray">
        <div>
          <Typography variant="Headline3" element="h2" className="mb-3 text-darkgray">
            {portfolio.name}
          </Typography>
          <Typography variant="Headline1" element="p" className="mb-3">
            {formatMoneyFromNumber(21341234.2134)}
          </Typography>
          <div className="flex items-center">
            <svg
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 0L12 10H0L6 0Z" fill="#00565B" />
            </svg>
            <Typography variant="Headline3" element="p" className="ml-3 text-evergreen">
              231.2 (0.34%)
            </Typography>
          </div>
        </div>
        <div>
          <svg
            width="216"
            height="99"
            viewBox="0 0 216 99"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M32.5228 85.264C24.7087 94.3124 8.25173 92.4273 1 90.3537V99H215V1C199.461 2.13106 182.589 7.22084 167.494 41.7181C152.398 76.2154 124.871 34.9317 118.656 26.4488C112.44 17.9658 101.784 12.3105 86.6888 41.7181C71.5934 71.1257 69.8174 64.9049 58.7178 66.0359C47.6183 67.167 42.2905 73.9533 32.5228 85.264Z"
              fill="url(#paint0_linear)"
            />
            <path
              d="M1 90.3537C8.25173 92.4274 24.7087 94.3125 32.5228 85.264C42.2905 73.9534 47.6183 67.167 58.7178 66.0359C69.8174 64.9049 71.5934 71.1257 86.6888 41.7181C101.784 12.3105 112.44 17.9658 118.656 26.4488C124.871 34.9317 152.398 76.2154 167.494 41.7181C182.589 7.22084 199.461 2.13106 215 1"
              stroke="#00565B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear"
                x1="108"
                y1="8.91919"
                x2="108"
                y2="99"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#00565B" stopOpacity="0.25" />
                <stop offset="1" stopColor="#00565B" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-8">
        <div className="flex items-center">
          <PercentageCircle percentDecimal={0.124} strokeColor="red" className="w-16" />
          <div className="ml-3">
            <Typography element="p" variant="Headline3" className="mb-2">
              $1,124.42
            </Typography>
            <Typography element="p" variant="Label" className="text-darkgray text-[1rem]">
              Stocks
            </Typography>
          </div>
        </div>

        <div className="flex items-center">
          <PercentageCircle percentDecimal={0.124} strokeColor="red" className="w-16" />
          <div className="ml-3">
            <Typography element="p" variant="Headline3" className="mb-2">
              $1,124.42
            </Typography>
            <Typography element="p" variant="Label" className="text-darkgray text-[1rem]">
              Crypto
            </Typography>
          </div>
        </div>

        <div className="flex items-center">
          <PercentageCircle percentDecimal={0.124} strokeColor="red" className="w-16" />
          <div className="ml-3">
            <Typography element="p" variant="Headline3" className="mb-2">
              $1,124.42
            </Typography>
            <Typography element="p" variant="Label" className="text-darkgray text-[1rem]">
              Real Estate
            </Typography>
          </div>
        </div>

        <div className="flex items-center">
          <PercentageCircle percentDecimal={0.124} strokeColor="red" className="w-16" />
          <div className="ml-3">
            <Typography element="p" variant="Headline3" className="mb-2">
              $1,124.42
            </Typography>
            <Typography element="p" variant="Label" className="text-darkgray text-[1rem]">
              Cash
            </Typography>
          </div>
        </div>

        <div className="flex items-center">
          <PercentageCircle percentDecimal={0.124} strokeColor="red" className="w-16" />
          <div className="ml-3">
            <Typography element="p" variant="Headline3" className="mb-2">
              $1,124.42
            </Typography>
            <Typography element="p" variant="Label" className="text-darkgray text-[1rem]">
              Custom
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummaryCard;
