import { AssetType } from '@zachweinberg/wealth-schema';
import { NextPage } from 'next';
import Layout from '~/components/Layout';
import Typography from '~/components/Typography';

interface Props {
  percentage: number;
  assetType: AssetType;
  amount: number;
}

const PercentageAllocation: React.FunctionComponent<Props> = ({
  percentage,
  amount,
  assetType,
}: Props) => {
  return (
    <div className="bg-white rounded-xl p-3">
      <div className="grid grid-cols-2 w-full h-full">
        <div>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="50" cy="50" r="35" fill="transparent" strokeWidth="2" stroke="blue" />
          </svg>
        </div>
        <div className="m-auto">
          <Typography element="p" variant="Headline2" className="text-dark mb-2">
            Stocks
          </Typography>
          <Typography element="p" variant="Headline3" className="text-darkgray">
            $4,205.92
          </Typography>
        </div>
      </div>
    </div>
  );
};

const New: NextPage = () => {
  return (
    <Layout title="Dashboard">
      <Typography element="h1" variant="Headline1" className="mb-6">
        My Portfolio
      </Typography>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-dark rounded-lg h-64">hi</div>
        <div className="grid grid-cols-2 grid-rows-2 gap-6">
          <PercentageAllocation percentage={0.18} />
          <PercentageAllocation percentage={0.41} />
          <PercentageAllocation percentage={0.24} />
          <PercentageAllocation percentage={0.71} />
        </div>
      </div>
    </Layout>
  );
};

export default New;
