import axios from 'axios';

interface IEXStockResponse {
  [ticker: string]: {
    quote: {
      latestPrice: number | null;
    };
  };
}

const IEX_BASE_URL = 'https://cloud.iexapis.com/stable';

const requestIEX = async <T>(path: string) => {
  const token = process.env.IEX_CLOUD_PUBLISHABLE_KEY;
  const url = `${IEX_BASE_URL}${path}&token=${token}`;
  const response = await axios.get(url);
  return response.data as T;
};

export const getStockPrices = async (
  symbols: string[]
): Promise<{ [symbol: string]: number | null }> => {
  const dedupedSymbols = [...new Set(symbols)];

  const response = await requestIEX<IEXStockResponse>(
    `/stock/market/batch?types=quote&filter=latestPrice&symbols=${dedupedSymbols.join(',')}`
  );

  return Object.keys(response).reduce(
    (accum, curr) => ({
      ...accum,
      [curr.toUpperCase()]: response[curr]?.quote?.latestPrice ?? null,
    }),
    {}
  );
};
