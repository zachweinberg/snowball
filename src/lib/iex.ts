import axios from 'axios';

interface IEXStockResponse {
  [ticker: string]: {
    quote: {
      latestPrice: number | undefined;
      change: number | undefined;
      changePercent: number | undefined;
      marketCap: number | undefined;
    };
  };
}

const token = process.env.IEX_CLOUD_PUBLISHABLE_KEY;

const IEX_BASE_URL = 'https://cloud.iexapis.com/stable';

const requestIEX = async <T>(path: string) => {
  const url = `${IEX_BASE_URL}${path}&token=${token}`;
  const response = await axios.get(url);
  return response.data as T;
};

export const getStockPrices = async (
  symbols: string[]
): Promise<{
  [symbol: string]: {
    latestPrice: number;
    change: number;
    changePercent: number;
    marketCap: number;
  };
}> => {
  const dedupedSymbols = [...new Set(symbols)];

  if (dedupedSymbols.length === 0) {
    return {};
  }

  const response = await requestIEX<IEXStockResponse>(
    `/stock/market/batch?types=quote&filter=marketCap,latestPrice,change,changePercent&symbols=${dedupedSymbols.join(',')}`
  );

  return Object.keys(response).reduce(
    (accum, curr) => ({
      ...accum,
      [curr.toUpperCase()]: {
        latestPrice: response[curr]?.quote?.latestPrice ?? 0,
        change: response[curr]?.quote?.change ?? 0,
        changePercent: response[curr]?.quote?.changePercent ?? 0,
        marketCap: response[curr]?.quote?.marketCap ?? 0,
      },
    }),
    {}
  );
};
