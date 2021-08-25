import {
  AssetType,
  CashPosition,
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  CryptoPosition,
  CustomPosition,
  GetPortfoliosResponse,
  Portfolio,
  PortfolioWithBalances,
  Position,
  RealEstatePosition,
  StockPosition,
} from '@zachweinberg/wealth-schema';
import currency from 'currency.js';
import { Router } from 'express';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { catchErrors, getUserFromAuthHeader, requireSignedIn } from '~/utils/api';
import { fetchDocument, findDocuments } from '~/utils/db';
import {
  calculateCashValue,
  calculateCryptoTotal,
  calculateCustomsValue,
  calculateRealEstateValue,
  calculateStocksTotal,
} from '~/utils/math';
import { capitalize } from '~/utils/misc';

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
      const assets = await findDocuments<Position>(`/portfolios/${portfolio.id}/positions`);

      const stocks = assets.filter((asset) => asset.assetType === AssetType.Stock) as StockPosition[];
      const crypto = assets.filter((asset) => asset.assetType === AssetType.Crypto) as CryptoPosition[];
      const realEstate = assets.filter((asset) => asset.assetType === AssetType.RealEstate) as RealEstatePosition[];
      const cash = assets.filter((asset) => asset.assetType === AssetType.Cash) as CashPosition[];
      const customs = assets.filter((asset) => asset.assetType === AssetType.Cash) as CustomPosition[];

      const [stocksValue, cryptoValue] = await Promise.all([
        calculateStocksTotal(stocks),
        calculateCryptoTotal(crypto),
      ]);
      const realEstateValue = await calculateRealEstateValue(realEstate);
      const cashValue = await calculateCashValue(cash);
      const customsValue = await calculateCustomsValue(customs);

      const totalValue = currency(stocksValue)
        .add(cryptoValue)
        .add(realEstateValue)
        .add(cashValue)
        .add(customsValue).value;

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

    // const response: PortfolioWithBalances = {
    //   status: 'ok',
    // };

    res.status(200).json({ status: 'ok', portfolio });
  })
);

export default portfoliosRouter;
