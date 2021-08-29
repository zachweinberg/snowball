import axios from 'axios';

interface CMCQuotesResponse {
  data: {
    [symbol: string]: {
      id: number;
      name: string;
      symbol: string;
      is_active: number;
      quote: { USD: { price: number; market_cap: number; percent_change_24h: number } };
    };
  };
}

interface CMCAllCoinsResponse {
  data: Array<{
    id: number;
    name: string;
    symbol: string;
    slug: string;
    rank: number;
    is_active: number;
  }>;
}

const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';

const requestCoinMarketCap = async <T>(path: string) => {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  const url = `${COINMARKETCAP_BASE_URL}${path}`;
  const response = await axios.get(url, { headers: { 'X-CMC_PRO_API_KEY': apiKey } });
  return response.data as T;
};

export const getCryptoPrices = async (
  coinSymbols: string[]
): Promise<{
  [symbol: string]: {
    latestPrice: number;
    changePercent: number;
  };
}> => {
  const dedupedSymbols = [...new Set(coinSymbols)];

  if (dedupedSymbols.length === 0) {
    return {};
  }

  const response = await requestCoinMarketCap<CMCQuotesResponse>(
    `/quotes/latest?symbol=${dedupedSymbols.join(',')}&aux=is_active`
  );
  console.log(response.data['BTC'].quote);
  return Object.keys(response.data).reduce(
    (accum, curr) => ({
      ...accum,
      [curr.toUpperCase()]: {
        latestPrice: response.data[curr]?.quote?.USD?.price ?? 0,
        changePercent: (response.data[curr]?.quote?.USD?.percent_change_24h ?? 0) / 100,
      },
    }),
    {}
  );
};

export const getAllActiveCoins = async () => {
  const data = await requestCoinMarketCap<CMCAllCoinsResponse>(`/map`);
  return data.data;
};
