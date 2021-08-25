import { AssetType } from '@zachweinberg/wealth-schema';
import algoliasearch from 'algoliasearch/lite';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

const stocksIndex = algoliaClient.initIndex('stocks');
const cryptoIndex = algoliaClient.initIndex('cryptocurrencies');

export interface SearchPositionsResult {
  fullName: string;
  symbol: string;
  assetType: AssetType;
  providerID: string;
  logoURL?: string;
}

export const searchStocks = async (searchTerm: string) => {
  const results = await stocksIndex.search<SearchPositionsResult>(searchTerm, {
    hitsPerPage: 8,
  });
  return results.hits ?? [];
};

export const searchCrypto = async (searchTerm: string) => {
  const results = await cryptoIndex.search<SearchPositionsResult>(searchTerm, {
    hitsPerPage: 8,
  });
  return results.hits ?? [];
};
