import {
  AssetType,
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  CryptoPosition,
  CryptoPositionWithQuote,
  GetPortfolioResponse,
  GetPortfoliosResponse,
  Portfolio,
  PortfolioWithBalances,
  StockPosition,
  StockPositionWithQuote,
} from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { getCryptoPrices } from '~/lib/cmc';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { getStockPrices } from '~/lib/iex';
import { catchErrors, getUserFromAuthHeader, requireSignedIn } from '~/utils/api';
import { fetchDocument, findDocuments } from '~/utils/db';
import { capitalize } from '~/utils/misc';
import { calculatePortfolioValues } from '~/utils/positions';

const portfoliosRouter = Router();

portfoliosRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const portfolios = await findDocuments<Portfolio>('portfolios', [
      { property: 'userID', condition: '==', value: userID },
    ]);

    if (portfolios.length === 0) {
      return res.status(200).json({ status: 'ok', portfolios: [] });
    }

    let portfoliosWithBalances: PortfolioWithBalances[] = [];

    for (const portfolio of portfolios) {
      const { totalValue, stocksValue, cryptoValue, realEstateValue, cashValue, customsValue } =
        await calculatePortfolioValues(portfolio.id);

      portfoliosWithBalances.push({
        ...portfolio,
        totalValue,
        totalPercentChange: 0,
        customsValue,
        stocksValue,
        realEstateValue,
        cryptoValue,
        cashValue,
      });
    }

    const response: GetPortfoliosResponse = {
      status: 'ok',
      portfolios: portfoliosWithBalances,
    };

    res.status(200).json(response);
  })
);

portfoliosRouter.post(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { name, public: isPublic } = req.body as CreatePortfolioRequest;
    const userID = req.authContext!.uid;

    const existingPortfolios = await findDocuments<Portfolio>('portfolios', [
      { property: 'userID', condition: '==', value: userID },
    ]);

    if (existingPortfolios.length >= 2) {
      return res.status(400).json({ status: 'error', error: 'You can only have 2 portfolios.' });
    }

    const newPortfolioDocRef = firebaseAdmin().firestore().collection('portfolios').doc();

    const portfolioDataToSet: Portfolio = {
      id: newPortfolioDocRef.id,
      userID,
      public: isPublic,
      name: capitalize(name).trim(),
      createdAt: new Date(),
    };

    await newPortfolioDocRef.set(portfolioDataToSet, { merge: true });

    const response: CreatePortfolioResponse = {
      status: 'ok',
      portfolio: portfolioDataToSet,
    };

    res.status(200).json(response);
  })
);

portfoliosRouter.get(
  '/:portfolioID',
  catchErrors(async (req, res) => {
    let userOwnsPortfolio = false;

    const portfolio = await fetchDocument<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (!portfolio.public && !userOwnsPortfolio) {
      // Private portfolio
      return res.status(404).json({ status: 'error', error: 'Portfolio does not exist.' });
    }

    const stockPositions = await findDocuments<StockPosition>(`portfolios/${portfolio.id}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Stock },
    ]);

    const priceMap = await getStockPrices(stockPositions.map((s) => s.symbol));

    let stockPositionsWithQuotes: StockPositionWithQuote[] = [];

    for (const stock of stockPositions) {
      if (priceMap[stock.symbol]) {
        stockPositionsWithQuotes.push({
          ...stock,
          dayChange: priceMap[stock.symbol].change * stock.quantity,
          gainLoss: priceMap[stock.symbol].latestPrice * stock.quantity - stock.costBasis * stock.quantity,
          marketValue: (priceMap[stock.symbol].latestPrice ?? 0) * stock.quantity,
          symbol: stock.symbol,
          last: priceMap[stock.symbol].latestPrice,
        });
      }
    }

    const cryptoPositions = await findDocuments<CryptoPosition>(`portfolios/${portfolio.id}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Crypto },
    ]);

    const cryptoPriceMap = await getCryptoPrices(cryptoPositions.map((s) => s.symbol));

    let cryptoPositionsWithQuotes: CryptoPositionWithQuote[] = [];

    for (const coin of cryptoPositions) {
      if (cryptoPriceMap[coin.symbol]) {
        cryptoPositionsWithQuotes.push({
          ...coin,
          dayChange:
            cryptoPriceMap[coin.symbol].changePercent * cryptoPriceMap[coin.symbol].latestPrice * coin.quantity,
          gainLoss: cryptoPriceMap[coin.symbol].latestPrice * coin.quantity - coin.costBasis * coin.quantity,
          marketValue: (cryptoPriceMap[coin.symbol].latestPrice ?? 0) * coin.quantity,
          symbol: coin.symbol,
          last: cryptoPriceMap[coin.symbol].latestPrice,
        });
      }
    }

    const response: GetPortfolioResponse = {
      status: 'ok',
      portfolio: {
        ...portfolio,
        stocks: stockPositionsWithQuotes,
        crypto: [],
      },
    };

    res.status(200).json(response);
  })
);

// portfoliosRouter.get(
//   '/:portfolioID/stocks',
//   catchErrors(async (req, res) => {
//     const portfolio = await fetchDocument<Portfolio>('portfolios', req.params.portfolioID);

//     let isUsersPortfolio = await userOwnsPortfolio(req, res, portfolio.id);

//     if (!portfolio.public && !isUsersPortfolio) {
//       return res.status(404).json({ status: 'error', error: 'Invalid' });
//     }

//     const stockPositions = await findDocuments<StockPosition>(`portfolios/${portfolio.id}/positions`, [
//       { property: 'assetType', condition: '==', value: AssetType.Stock },
//     ]);

//     const priceMap = await getStockPrices(stockPositions.map((s) => s.symbol));

//     let stockPositionsWithQuotes: StockPositionWithQuote[] = [];

//     for (const stock of stockPositions) {
//       if (priceMap[stock.symbol]) {
//         stockPositionsWithQuotes.push({
//           ...stock,
//           dayChange: priceMap[stock.symbol].change * stock.quantity,
//           gainLoss: priceMap[stock.symbol].latestPrice * stock.quantity - stock.costBasis * stock.quantity,
//           marketValue: (priceMap[stock.symbol].latestPrice ?? 0) * stock.quantity,
//           symbol: stock.symbol,
//           last: priceMap[stock.symbol].latestPrice,
//         });
//       }
//     }

//     const response: GetPortfolioResponse = {
//       status: 'ok',
//       portfolio: {
//         ...portfolio,
//         stocks: stockPositionsWithQuotes,
//         crypto: [],
//       },
//     };

//     res.status(200).json(response);
//   })
// );

export default portfoliosRouter;
