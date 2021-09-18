import { AssetType } from '@zachweinberg/wealth-schema';
import { NextPage } from 'next';
import Layout from '~/components/Layout';
import AssetPercentCard from '~/components/portfolio-dashboard/AssetPercentCard';
import BalanceOverTimeChart from '~/components/portfolio-dashboard/BalanceOverTimeChart';
import Typography from '~/components/Typography';

const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindConfig = require('../../tailwind.config');
const { theme } = resolveConfig(tailwindConfig);

const New: NextPage = () => {
  return (
    <Layout title="Dashboard">
      <Typography element="h1" variant="Headline1" className="mb-6">
        My Portfolio
      </Typography>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-64 lg:h-full">
          <BalanceOverTimeChart />
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-6">
          <AssetPercentCard
            amount={412.32}
            percent={0.7182}
            strokeColor={theme.colors['lime']}
            assetType={AssetType.Stock}
          />
          <AssetPercentCard
            amount={124992.12}
            percent={0.2182}
            strokeColor={theme.colors['purple']}
            assetType={AssetType.RealEstate}
          />
          <AssetPercentCard
            amount={412.32}
            percent={0.7182}
            strokeColor={theme.colors['evergreen']}
            assetType={AssetType.Crypto}
          />
          <AssetPercentCard
            amount={41212.32}
            percent={0.6182}
            strokeColor={theme.colors['rust']}
            assetType={AssetType.Cash}
          />
        </div>
      </div>
    </Layout>
  );
};

export default New;
