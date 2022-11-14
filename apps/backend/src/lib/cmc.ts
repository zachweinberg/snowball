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

const requestCoinMarketCap = async <T>(url: string) => {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  const response = await axios.get(url, { headers: { 'X-CMC_PRO_API_KEY': apiKey } });
  return response.data as T;
};

export const getCryptoPrices = async (
  coinIDs: string[]
): Promise<{
  [symbol: string]: {
    latestPrice: number;
    changePercent: number;
    marketCap: number;
  };
}> => {
  const dedupedIDs = [...new Set(coinIDs)];

  if (dedupedIDs.length === 0) {
    return {};
  }

  const response = await requestCoinMarketCap<CMCQuotesResponse>(
    `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${dedupedIDs.join(',')}&aux=is_active`
  );

  return Object.keys(response.data).reduce((accum, curr) => {
    const symbol = response.data[curr].symbol;

    return {
      ...accum,
      [symbol.toUpperCase()]: {
        latestPrice: response.data[curr]?.quote?.USD?.price ?? 0,
        changePercent: (response.data[curr]?.quote?.USD?.percent_change_24h ?? 0) / 100,
        marketCap: response.data[curr]?.quote?.USD?.market_cap ?? 0,
      },
    };
  }, {});
};

export const getAllActiveCoins = async () => {
  const data = await requestCoinMarketCap<CMCAllCoinsResponse>(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/map`);
  return data.data;
};
