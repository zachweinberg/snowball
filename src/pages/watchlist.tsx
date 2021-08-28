import type { NextPage } from 'next';
import { useState } from 'react';
import PositionSelector from '~/components/form/PositionSelector';
import Layout from '~/components/Layout';
import Spinner from '~/components/Spinner';
import { searchCrypto, searchStocks } from '~/lib/algolia';
import { API } from '~/lib/api';

const WatchList: NextPage = () => {
  const [symbol, setSymbol] = useState('');
  const [stocks, setStocks] = useState([]);
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <Layout title="News">
      <h1 className="mb-5 text-xl font-bold leading-7 text-blue3 sm:text-2xl sm:truncate">
        Watchlist
      </h1>

      {loading ? (
        <div className="flex justify-center w-full">
          <Spinner size={40} />
        </div>
      ) : (
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-10">
            <div>
              <PositionSelector
                label="Add stocks"
                name="asdg"
                placeholder="Search stocks..."
                onSelect={(symbol, fullName) => API}
                fetcher={searchStocks}
              />
            </div>
            <div>
              <PositionSelector
                label="Add crypto"
                name="asdg"
                placeholder="Search crypto..."
                onSelect={() => null}
                fetcher={searchCrypto}
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default WatchList;
