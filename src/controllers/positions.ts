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
  PlaidItem,
  PlanType,
  RealEstatePosition,
  StockPosition,
} from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { ItemRemoveRequest } from 'plaid';
import { plaidClient } from '~/lib/plaid';
import { deleteRedisKey } from '~/lib/redis';
import { logSentryError } from '~/lib/sentry';
import { getPropertyValueEstimateByGooglePlaceID } from '~/lib/valuations';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { decrypt } from '~/utils/crypto';
import { createDocument, deleteDocument, fetchDocumentByID, findDocuments, updateDocument } from '~/utils/db';
import { trackPortfolioLogItem } from '~/utils/logs';
import { addresstoString } from '~/utils/misc';
import { formatMoneyFromNumber } from '~/utils/money';
import { userOwnsPortfolio } from '~/utils/portfolios';

const positionsRouter = Router();

positionsRouter.post(
  '/stock',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { portfolioID, symbol, companyName, quantity, costPerShare } = req.body as AddStockRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const existingStockPositions = await findDocuments<StockPosition>(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Stock },
    ]);

    if (existingStockPositions.length >= 4 && req.user!.plan.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to add more than four stock positions per portfolio, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingStockPositions.length >= 30) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to 30 stock positions in a portfolio.',
        code: 'MAX_PLAN',
      });
    }

    const stocksExisting = existingStockPositions.filter((stockPosition) => stockPosition.symbol === symbol.toUpperCase());

    if (stocksExisting.length > 0) {
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

    await trackPortfolioLogItem(
      portfolioID,
      `Added ${quantity} shares of ${symbol} @ ${formatMoneyFromNumber(costPerShare)} each.`
    );

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
    const userID = req.user!.id;
    const { portfolioID, symbol, coinName, quantity, costPerCoin, logoURL } = req.body as AddCryptoRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const existingCryptoPositions = await findDocuments<StockPosition>(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Crypto },
    ]);

    if (existingCryptoPositions.length >= 4 && req.user!.plan.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to add more than four crypto positions per portfolio, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingCryptoPositions.length >= 30) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to 30 crypto positions in a portfolio.',
        code: 'MAX_PLAN',
      });
    }

    const cryptoExisting = existingCryptoPositions.filter((cryptoPosition) => cryptoPosition.symbol === symbol.toUpperCase());

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

    await trackPortfolioLogItem(portfolioID, `Added ${quantity} ${symbol} @ ${formatMoneyFromNumber(costPerCoin)} each.`);

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
    const userID = req.user!.id;

    const { portfolioID, propertyType, propertyValue, placeID, apt, name, automaticValuation } = req.body as AddRealEstateRequest;

    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const existingREPositions = await findDocuments('real-estate-positions', [
      { property: 'portfolioID', condition: '==', value: portfolioID },
    ]);

    if (existingREPositions.length >= 2 && req.user!.plan.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to add more than two real estate holdings per portfolio, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingREPositions.length >= 20) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to 20 real estate holdings in a portfolio.',
        code: 'MAX_PLAN',
      });
    }

    let position: Partial<RealEstatePosition> = {
      portfolioID,
      name,
      assetType: AssetType.RealEstate,
      propertyType,
      createdAt: new Date(),
      automaticValuation: false,
    };

    if (automaticValuation) {
      if (!placeID) {
        return res.status(400).json({
          status: 'error',
          error: 'Invalid address.',
        });
      }

      const { address, estimate } = await getPropertyValueEstimateByGooglePlaceID(placeID, apt);

      if (!estimate || !address) {
        return res.status(404).json({
          status: 'error',
          error: "It looks like we don't have any estimates for that property. Please uncheck the automatic valuation box.",
        });
      }

      position.automaticValuation = true;
      position.propertyValue = estimate;
      position.address = address;
      position.googlePlaceID = placeID;
    } else {
      position.propertyValue = propertyValue as number;
    }

    await createDocument<RealEstatePosition>(`real-estate-positions`, position);
    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`);

    const response = {
      status: 'ok',
    };

    await trackPortfolioLogItem(
      portfolioID,
      `Added ${name ?? 'a property'} worth ${formatMoneyFromNumber(position.propertyValue)}.`
    );

    res.status(200).json(response);
  })
);

positionsRouter.post(
  '/cash',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { portfolioID, amount, accountName } = req.body as AddCashRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const existingCashPositions = await findDocuments(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Cash },
    ]);

    if (existingCashPositions.length >= 4 && req.user!.plan.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to add more than four cash positions per portfolio, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingCashPositions.length >= 30) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to 30 cash positions in a portfolio.',
        code: 'MAX_PLAN',
      });
    }

    await createDocument<CashPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Cash,
      accountName,
      amount,
      createdAt: new Date(),
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    await trackPortfolioLogItem(portfolioID, `Added ${accountName ?? 'a cash account'} with ${formatMoneyFromNumber(amount)}.`);

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
    const userID = req.user!.id;
    const { portfolioID, value, assetName } = req.body as AddCustomAssetRequest;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const existingCustom = await findDocuments(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Custom },
    ]);

    if (existingCustom.length >= 4 && req.user!.plan.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to add more than four custom assets per portfolio, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingCustom.length >= 30) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to 30 custom positions in a portfolio.',
        code: 'MAX_PLAN',
      });
    }

    await createDocument<CustomPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Custom,
      value,
      assetName,
      createdAt: new Date(),
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    await trackPortfolioLogItem(portfolioID, `Added ${assetName ?? 'a custom asset'} worth ${formatMoneyFromNumber(value)}.`);

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

// UPDATE

positionsRouter.put(
  '/stock',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { portfolioID, positionID, quantity, costPerShare } = req.body;

    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const position = await fetchDocumentByID<StockPosition>(`portfolios/${portfolioID}/positions`, positionID);

    await updateDocument(`portfolios/${portfolioID}/positions`, positionID, {
      quantity,
      costPerShare,
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    await trackPortfolioLogItem(
      portfolioID,
      `Updated ${position.symbol} to ${quantity} shares and cost per share of ${formatMoneyFromNumber(costPerShare)}.`
    );

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.put(
  '/crypto',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { portfolioID, positionID, quantity, costPerCoin } = req.body;

    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const position = await fetchDocumentByID<CryptoPosition>(`portfolios/${portfolioID}/positions`, positionID);

    await updateDocument(`portfolios/${portfolioID}/positions`, positionID, {
      quantity,
      costPerCoin,
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    await trackPortfolioLogItem(
      portfolioID,
      `Updated ${position.symbol} quantity to ${quantity} and cost per coin of ${formatMoneyFromNumber(costPerCoin)}.`
    );

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.put(
  '/real-estate',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { portfolioID, name, propertyType, propertyValue, positionID, automaticValuation } =
      req.body as AddRealEstateRequest & {
        positionID: string;
      };

    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const position = await fetchDocumentByID<RealEstatePosition>(`real-estate-positions`, positionID);

    await updateDocument(`real-estate-positions`, positionID, {
      propertyType,
      propertyValue: propertyValue ?? null,
      automaticValuation,
      name,
    });

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`);

    await trackPortfolioLogItem(portfolioID, `Updated ${name ?? 'a property'}.`);

    let log = `Updated ${
      position.address ? addresstoString(position.address) : position.name ? position.name : 'a property'
    } to ${propertyType} and automatic valuation to ${automaticValuation ? 'on' : 'off'}.`;

    if (position.propertyValue !== propertyValue && propertyValue) {
      log += `New property value: ${formatMoneyFromNumber(propertyValue)}`;
    }

    await trackPortfolioLogItem(portfolioID, log);

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.put(
  '/cash',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
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

    await trackPortfolioLogItem(
      portfolioID,
      `Updated ${accountName ?? 'cash'} to a balance of ${formatMoneyFromNumber(amount)}.`
    );

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

positionsRouter.put(
  '/custom',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
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

    await trackPortfolioLogItem(
      portfolioID,
      `Updated ${assetName ?? 'custom asset'} to new value ${formatMoneyFromNumber(value)}.`
    );

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
    const { portfolioID, assetType } = req.query as { portfolioID: string; assetType: AssetType };
    const { positionID } = req.params;
    const userID = req.user!.id;
    const redisKey = `portfolio-${portfolioID}`;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    let log = '';

    if (assetType === AssetType.Stock) {
      const position = await fetchDocumentByID<StockPosition>(`portfolios/${portfolioID}/positions`, positionID);
      await deleteDocument(`portfolios/${portfolioID}/positions/${positionID}`);
      log = `Deleted ${position.quantity} ${position.symbol} from portfolio.`;
    }

    if (assetType === AssetType.Crypto) {
      const position = await fetchDocumentByID<CryptoPosition>(`portfolios/${portfolioID}/positions`, positionID);
      await deleteDocument(`portfolios/${portfolioID}/positions/${positionID}`);
      log = `Deleted ${position.quantity} ${position.symbol} from portfolio.`;
    }

    if (assetType === AssetType.RealEstate) {
      const position = await fetchDocumentByID<RealEstatePosition>(`real-estate-positions`, positionID);
      await deleteDocument(`real-estate-positions/${positionID}`);
      log = `Deleted ${
        position.address ? addresstoString(position.address) : position.name ? position.name : 'a property'
      } from portfolio.`;
    }

    if (assetType === AssetType.Cash) {
      const position = await fetchDocumentByID<CashPosition>(`portfolios/${portfolioID}/positions`, positionID);

      if (position.isPlaid) {
        const plaidItem = await fetchDocumentByID<PlaidItem>('plaid-items', position.plaidItemID!);

        const itemRemoveReq: ItemRemoveRequest = {
          access_token: decrypt(plaidItem.plaidAccessToken),
        };

        try {
          await Promise.all([
            plaidClient.itemRemove(itemRemoveReq),
            deleteDocument(`portfolios/${portfolioID}/positions/${positionID}`),
            deleteDocument(`plaid-items/${position.plaidItemID}`),
            deleteDocument(`plaid-accounts/${position.plaidAccountID}`),
          ]);
        } catch (err) {
          logSentryError(err);
          throw err;
        }
      }

      log = `Deleted ${position.accountName} with ${formatMoneyFromNumber(position.amount)} from portfolio.`;
    }

    if (assetType === AssetType.Custom) {
      const position = await fetchDocumentByID<CustomPosition>(`portfolios/${portfolioID}/positions`, positionID);
      await deleteDocument(`portfolios/${portfolioID}/positions/${positionID}`);
      log = `Deleted ${position.assetName} worth ${formatMoneyFromNumber(position.value)} from portfolio.`;
    }

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`);

    await trackPortfolioLogItem(portfolioID, log);

    res.status(200).end();
  })
);

export default positionsRouter;
