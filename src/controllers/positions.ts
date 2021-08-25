import {
  AddCashRequest,
  AddCryptoRequest,
  AddRealEstateRequest,
  AddStockRequest,
  AssetType,
  CashPosition,
  CryptoPosition,
  Portfolio,
  RealEstatePosition,
  StockPosition,
} from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, fetchDocument } from '~/utils/db';

const positionsRouter = Router();

const userOwnsPortfolio = async (req, res, portfolioID) => {
  const userID = req.authContext!.uid;

  const portfolio = await fetchDocument<Portfolio>('portfolios', portfolioID);

  if (portfolio.userID !== userID) {
    return false;
  }

  return true;
};

positionsRouter.post(
  '/stock',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, symbol, companyName, quantity, costBasis, note } =
      req.body as AddStockRequest;

    if (!userOwnsPortfolio(req, res, portfolioID)) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<StockPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Stock,
      companyName,
      costBasis,
      quantity,
      symbol: symbol.toUpperCase(),
      createdAt: new Date(),
      note: note ? note : '',
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.post(
  '/crypto',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, symbol, coinName, quantity, costBasis, note } =
      req.body as AddCryptoRequest;

    if (!userOwnsPortfolio(req, res, portfolioID)) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<CryptoPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Crypto,
      coinName,
      costBasis,
      quantity,
      symbol: symbol.toUpperCase(),
      createdAt: new Date(),
      note: note ? note : '',
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.post(
  '/real-estate',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, address, estimatedAppreciationRate, propertyType, propertyValue, note } =
      req.body as AddRealEstateRequest;

    if (!userOwnsPortfolio(req, res, portfolioID)) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<RealEstatePosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.RealEstate,
      propertyType,
      propertyValue,
      estimatedAppreciationRate,
      createdAt: new Date(),
      note: note ? note : '',
      address: address ? address : '',
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.post(
  '/cash',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, amount, accountName, note } = req.body as AddCashRequest;

    if (!userOwnsPortfolio(req, res, portfolioID)) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<CashPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Cash,
      accountName,
      amount,
      createdAt: new Date(),
      note: note ? note : '',
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

export default positionsRouter;
