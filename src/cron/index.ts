import { DailyBalance, Portfolio } from '@zachweinberg/obsidian-schema';
import algoliasearch from 'algoliasearch';
import axios from 'axios';
import * as csv from 'fast-csv';
import { getAllActiveCoins } from '~/lib/cmc';
import { createDocument, findDocuments } from '~/utils/db';
import { calculatePortfolioSummary } from '~/utils/positions';
import { triggerPriceAlertsJobs } from './alerts';

interface CMCCoin {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  rank: number;
  is_active: number;
}

interface AlphaVantageStock {
  symbol: string;
  status: string;
  name: string;
}

const algoliaClient = algoliasearch(process.env.ALGOLIA_APP_ID!, process.env.ALGOLIA_ADMIN_KEY!);

const chunk = (arr: any[], size: number) => {
  let newArr: any[] = [];

  for (let i = 0; i < arr.length; i += size) {
    newArr.push(arr.slice(i, i + size));
  }

  return newArr;
};

const indexAllCryptocurrenciesInAlgolia = async () => {
  try {
    const allCoins = await getAllActiveCoins();

    const index = algoliaClient.initIndex('cryptocurrencies');

    let coinChunks = chunk(allCoins, 500) as Array<CMCCoin[]>;

    for (const chunk of coinChunks) {
      await index.batch(
        chunk.map((coin) => ({
          action: 'updateObject',
          body: {
            fullName: coin.name,
            symbol: coin.symbol,
            logoURL: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
            objectID: String(coin.id),
            providerID: String(coin.id),
          },
        }))
      );
      console.log('> Indexed 500 coins');
    }

    console.log('Success');
    process.exit(0);
  } catch (err) {
    console.error('Could not complete function');
    console.log(err);
    process.exit(1);
  }
};

const indexAllStocksInAlgolia = async () => {
  try {
    const avApiKey = process.env.ALPHAVANTAGE_API_KEY!;

    try {
      const response = await axios({
        url: `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${avApiKey}&state=active`,
        method: 'get',
        responseType: 'stream',
      });

      const index = algoliaClient.initIndex('stocks');

      let allStocksToIndex: AlphaVantageStock[] = [];

      response.data
        .pipe(csv.parse({ headers: true }))
        .on('error', (error: any) => console.error(error))
        .on('data', (row: AlphaVantageStock) => {
          const avStock = row;
          allStocksToIndex.push(avStock);
        })
        .on('end', async (rowCount: number) => {
          let stockChunks = chunk(allStocksToIndex, 700) as Array<AlphaVantageStock[]>;

          for (const chunk of stockChunks) {
            // Remove bad stocks
            const filteredChunk = chunk.filter((stock) => {
              if (
                (stock.status !== 'Active' ||
                  stock.symbol === '' ||
                  stock.name === '' ||
                  stock.symbol.includes('-') ||
                  stock.symbol.includes('.')) &&
                !stock.symbol.includes('BRK')
              ) {
                return false;
              }
              return true;
            });

            await index.batch(
              filteredChunk.map((stock) => {
                return {
                  action: 'updateObject',
                  body: {
                    fullName: stock.name,
                    // IEX Cloud uses periods, not hyphens
                    symbol: stock.symbol.replace('-', '.'),
                    objectID: stock.symbol.replace('-', '.'),
                    providerID: stock.symbol.replace('-', '.'),
                  },
                };
              })
            );
            console.log('> Indexed 700 stocks');
          }

          console.log('Success');
          process.exit(0);
        });
    } catch (err) {
      throw err;
    }
  } catch (err) {
    console.error('Could not complete function');
    console.log(err);
    process.exit(1);
  }
};

const addDailyBalancesToPortfolio = async () => {
  const portfolios = await findDocuments<Portfolio>('portfolios');

  for (const portfolio of portfolios) {
    const { cryptoValue, cashValue, stocksValue, realEstateValue, customsValue, totalValue } =
      await calculatePortfolioSummary(portfolio.id);

    await createDocument<DailyBalance>(`portfolios/${portfolio.id}/dailyBalances`, {
      date: new Date(),
      cashValue,
      cryptoValue,
      stocksValue,
      realEstateValue,
      customsValue,
      totalValue,
    });
  }
};

const runCron = async () => {
  try {
    switch (process.argv[2]) {
      case 'index-stocks':
        await indexAllStocksInAlgolia();
        break;
      case 'index-crypto':
        await indexAllCryptocurrenciesInAlgolia();
        break;
      case 'daily-balances':
        await addDailyBalancesToPortfolio();
        break;
      case 'process-alerts':
        await triggerPriceAlertsJobs();
        break;

      default:
        console.error('Invalid job. Did you supply the job name as a param?');
        break;
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Entry
runCron();
