import { AssetType, WatchListItem } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import PositionSelector from '~/components/form/PositionSelector';
import Layout from '~/components/layout/Layout';
import Spinner from '~/components/ui/Spinner';
import { searchCrypto, searchStocks } from '~/lib/algolia';
import { API } from '~/lib/api';
import { formatMoneyFromNumber, formatPercentageChange } from '~/lib/money';

const WatchList: NextPage = () => {
  const [symbol, setSymbol] = useState('');
  const [stocks, setStocks] = useState<WatchListItem[]>([]);
  const [crypto, setCrypto] = useState<WatchListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getWatchlist()
      .then((watchlistData) => {
        setStocks(watchlistData.stocks);
        setCrypto(watchlistData.crypto);
      })
      .catch((err) => alert('Could not load your watchlist.'))
      .finally(() => setLoading(false));
  }, []);

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
        <>
          <div className="grid grid-cols-2 gap-10 mb-5">
            <div>
              <PositionSelector
                label="Add stocks"
                name="asdg"
                placeholder="Search stocks..."
                onSelect={(symbol, fullName) =>
                  API.addAssetToWatchList(symbol, fullName, AssetType.Stock)
                }
                fetcher={searchStocks}
              />
            </div>
            <div>
              <PositionSelector
                label="Add crypto"
                name="asdg"
                placeholder="Search crypto..."
                onSelect={(symbol, fullName) =>
                  API.addAssetToWatchList(symbol, fullName, AssetType.Crypto)
                }
                fetcher={searchCrypto}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 mb-5">
            <div>
              {stocks.map((stock) => (
                <div className="flex items-center justify-between p-3 mb-2 bg-white rounded-md shadow-md">
                  <div>
                    <span className="mr-3">{stock.symbol}</span>
                    <span>{formatMoneyFromNumber(stock.latestPrice)}</span>
                  </div>
                  <div>
                    <span className="mr-3">{formatMoneyFromNumber(stock.changeDollars)}</span>
                    <span>{formatPercentageChange(stock.changePercent)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {crypto.map((coin) => (
                <div className="flex items-center justify-between p-3 mb-2 bg-white rounded-md shadow-md">
                  <div>
                    <span className="mr-3">{coin.symbol}</span>
                    <span>{formatMoneyFromNumber(coin.latestPrice)}</span>
                  </div>
                  <div>
                    <span className="mr-3">{formatMoneyFromNumber(coin.changeDollars)}</span>
                    <span>{formatPercentageChange(coin.changePercent)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default WatchList;
