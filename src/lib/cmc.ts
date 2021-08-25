import axios from 'axios';

interface CMCResponse {
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

const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';

const requestCoinMarketCap = async <T>(path: string) => {
  const apiKey = process.env.COINMARKETCAP_API_KEY;
  const url = `${COINMARKETCAP_BASE_URL}${path}`;
  const response = await axios.get(url, { headers: { 'X-CMC_PRO_API_KEY': apiKey } });
  return response.data as T;
};

export const getCryptoPrices = async (coinSymbols: string[]): Promise<{ [symbol: string]: number | null }> => {
  const dedupedSymbols = [...new Set(coinSymbols)];

  const response = await requestCoinMarketCap<CMCResponse>(
    `/quotes/latest?symbol=${dedupedSymbols.join(',')}&aux=is_active`
  );

  return Object.keys(response.data).reduce(
    (accum, curr) => ({ ...accum, [curr.toUpperCase()]: response.data[curr]?.quote?.USD?.price ?? null }),
    {}
  );
};
