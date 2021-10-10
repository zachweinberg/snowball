import {
  AddCashRequest,
  AddCryptoRequest,
  AddCustomAssetRequest,
  AddRealEstateRequest,
  AddStockRequest,
  AssetType,
  CashPosition,
  CryptoPosition,
  CustomPosition,
  RealEstatePosition,
  StockPosition,
} from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, deleteDocument } from '~/utils/db';
import { userOwnsPortfolio } from '~/utils/portfolios';

const positionsRouter = Router();

positionsRouter.post(
  '/stock',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, symbol, companyName, quantity, costPerShare, note } = req.body as AddStockRequest;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<StockPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Stock,
      companyName,
      costPerShare,
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
    const { portfolioID, symbol, coinName, quantity, costPerCoin, note, logoURL } = req.body as AddCryptoRequest;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<CryptoPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Crypto,
      coinName,
      costPerCoin,
      logoURL,
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
    const { portfolioID, address, propertyType, propertyValue, note } = req.body as AddRealEstateRequest;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<RealEstatePosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.RealEstate,
      propertyType,
      propertyValue,
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

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
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

positionsRouter.post(
  '/custom',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, value, assetName, note } = req.body as AddCustomAssetRequest;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<CustomPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Custom,
      value,
      assetName,
      createdAt: new Date(),
      note: note ? note : '',
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.delete(
  '/:positionID',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID } = req.query as { positionID: string; portfolioID: string };
    const { positionID } = req.params;

    if (!positionID || !portfolioID) {
      return res.status(400).end();
    }

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await deleteDocument(`portfolios/${portfolioID}/positions/${positionID}`);

    res.status(200).end();
  })
);

export default positionsRouter;
