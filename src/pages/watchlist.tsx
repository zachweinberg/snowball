import { AssetType, WatchListItem } from '@zachweinberg/wealth-schema';
import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import PositionSelector from '~/components/form/PositionSelector';
import Layout from '~/components/Layout';
import Spinner from '~/components/Spinner';
import { searchCrypto, searchStocks } from '~/lib/algolia';
import { API } from '~/lib/api';

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
        <div className="mb-5">
          <div className="grid grid-cols-2 gap-10">
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
        </div>

        <div>
          <tr className="transition-colors bg-white shadow-sm cursor-pointer hover:bg-blue0">
              <td className="px-6 py-3 tracking-wider text-left truncate text-blue1 rounded-bl-md rounded-tl-md">
                <div className="text-sm font-bold">{stock.symbol}</div>
                <div className="w-40 text-sm font-medium text-left truncate text-purple2">
                  {stock.companyName}
                </div>
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {stock.quantity}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(stock.last)}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(stock.marketValue)}
              </td>
              <td
                className={classNames(
                  `px-6 py-3 text-sm font-medium tracking-wider text-left`,
                  stock.dayChange < 0 ? 'text-red2' : 'text-green2'
                )}
              >
                <i className="align-middle fas fa-sort-up"></i>
                {formatMoneyFromNumber(stock.dayChange)}
              </td>
              <td className="px-6 py-3 text-sm font-medium tracking-wider text-left text-purple2">
                {formatMoneyFromNumber(stock.costBasis)}
              </td>
              <td
                className={classNames(
                  'px-6 py-3 tracking-wider text-left font-medium rounded-br-md text-sm rounded-tr-md',
                  stock.gainLoss < 0 ? 'text-red2' : 'text-green2'
                )}
              >
                <i className="fas fa-sort-up"></i> {formatMoneyFromNumber(stock.gainLoss)}
              </td>
            </tr>
        </div>
      )}
    </Layout>
  );
};

export default WatchList;
