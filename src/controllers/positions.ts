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
import { deleteRedisKey } from '~/lib/redis';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, deleteDocument, findDocuments, updateDocument } from '~/utils/db';
import { userOwnsPortfolio } from '~/utils/portfolios';

const positionsRouter = Router();

positionsRouter.post(
  '/stock',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;
    const { portfolioID, symbol, companyName, quantity, costPerShare } = req.body as AddStockRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const stockExisting = await findDocuments<StockPosition>(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Stock },
      { property: 'symbol', condition: '==', value: symbol.toUpperCase() },
    ]);

    if (stockExisting.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'You already have that stock in your portfolio. Please edit the position instead.',
      });
    }

    await createDocument<StockPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Stock,
      companyName,
      costPerShare,
      quantity,
      symbol: symbol.toUpperCase(),
      createdAt: new Date(),
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

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
    const userID = req.authContext!.uid;
    const { portfolioID, symbol, coinName, quantity, costPerCoin, logoURL } = req.body as AddCryptoRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const cryptoExisting = await findDocuments<CryptoPosition>(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Crypto },
      { property: 'symbol', condition: '==', value: symbol.toUpperCase() },
    ]);

    if (cryptoExisting.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'You already have that cryptocurrency in your portfolio. Please edit the position instead.',
      });
    }

    await createDocument<CryptoPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Crypto,
      coinName,
      costPerCoin,
      logoURL,
      quantity,
      symbol: symbol.toUpperCase(),
      createdAt: new Date(),
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

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
    const userID = req.authContext!.uid;
    const { portfolioID, address, propertyType, propertyValue } = req.body as AddRealEstateRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<RealEstatePosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.RealEstate,
      propertyType,
      propertyValue,
      createdAt: new Date(),
      address: address ? address : '',
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

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
    const userID = req.authContext!.uid;
    const { portfolioID, amount, accountName } = req.body as AddCashRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<CashPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Cash,
      accountName,
      amount,
      createdAt: new Date(),
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

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
    const userID = req.authContext!.uid;
    const { portfolioID, value, assetName } = req.body as AddCustomAssetRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<CustomPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Custom,
      value,
      assetName,
      createdAt: new Date(),
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

// UPDATE
positionsRouter.put(
  '/real-estate',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;
    const { portfolioID, address, propertyType, propertyValue, positionID } = req.body as AddRealEstateRequest & {
      positionID: string;
    };

    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await updateDocument(`portfolios/${portfolioID}/positions`, positionID, {
      propertyType,
      propertyValue,
      address: address ? address : '',
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

// UPDATE
positionsRouter.put(
  '/cash',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;
    const { portfolioID, amount, accountName, positionID } = req.body as AddCashRequest & { positionID: string };
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await updateDocument(`portfolios/${portfolioID}/positions`, positionID, {
      accountName,
      amount,
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

// UPDATE
positionsRouter.put(
  '/custom',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;
    const { portfolioID, value, assetName, positionID } = req.body as AddCustomAssetRequest & {
      positionID: string;
    };
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await updateDocument(`portfolios/${portfolioID}/positions`, positionID, {
      value,
      assetName,
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

// DELETE
positionsRouter.delete(
  '/:positionID',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID } = req.query as { positionID: string; portfolioID: string };
    const { positionID } = req.params;
    const userID = req.authContext!.uid;
    const redisKey = `portfolio-${portfolioID}`;

    if (!positionID || !portfolioID) {
      return res.status(400).end();
    }

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await deleteDocument(`portfolios/${portfolioID}/positions/${positionID}`);

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`);

    res.status(200).end();
  })
);

export default positionsRouter;
