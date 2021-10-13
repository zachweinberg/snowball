import {
  AssetType,
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  EditPortfolioSettingsRequest,
  GetPortfolioResponse,
  GetPortfolioSettingsResponse,
  GetPortfoliosResponse,
  Period,
  Portfolio,
} from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { deleteRedisKey, getRedisKey, setRedisKey } from '~/lib/redis';
import { catchErrors, getUserFromAuthHeader, requireSignedIn } from '~/utils/api';
import { fetchDocument, findDocuments, updateDocument } from '~/utils/db';
import { capitalize } from '~/utils/misc';
import { getPortfolioDailyHistory } from '~/utils/portfolios';
import { calculatePortfolioQuotes, calculatePortfolioSummary } from '~/utils/positions';

const portfoliosRouter = Router();

portfoliosRouter.get(
  '/:portfolioID/settings',
  catchErrors(async (req, res) => {
    let userOwnsPortfolio = false;

    const portfolio = await fetchDocument<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (!userOwnsPortfolio) {
      // Private portfolio
      return res.status(404).json({ status: 'error', error: 'Could not find page.' });
    }

    const response: GetPortfolioSettingsResponse = {
      status: 'ok',
      portfolio,
    };

    res.status(200).json(response);
  })
);

portfoliosRouter.put(
  '/:portfolioID/settings',
  catchErrors(async (req, res) => {
    const { settings } = req.body as EditPortfolioSettingsRequest;

    let userOwnsPortfolio = false;

    const portfolio = await fetchDocument<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (!userOwnsPortfolio) {
      // Private portfolio
      return res.status(403).end();
    }

    await updateDocument('portfolios', req.params.portfolioID, { settings });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

portfoliosRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;
    const redisKey = `portfoliolist-${userID}`;

    const cachedResponse = await getRedisKey(redisKey);

    if (cachedResponse) {
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    const portfolios = await findDocuments<Portfolio>('portfolios', [
      { property: 'userID', condition: '==', value: userID },
    ]);

    if (portfolios.length === 0) {
      return res.status(200).json({ status: 'ok', portfolios: [] });
    }

    let portfoliosWithBalances: any[] = [];

    for (const portfolio of portfolios) {
      const summary = await calculatePortfolioSummary(portfolio.id);

      const dailyBalances = await getPortfolioDailyHistory(portfolio.id, 30);

      portfoliosWithBalances.push({
        ...portfolio,
        dailyBalances,
        dayChange: summary.dayChange,
        dayChangePercent: summary.dayChangePercent,
        totalValue: summary.totalValue,
        customsValue: summary.customsValue,
        stocksValue: summary.stocksValue,
        realEstateValue: summary.realEstateValue,
        cryptoValue: summary.cryptoValue,
        cashValue: summary.cashValue,
      });
    }

    const response: GetPortfoliosResponse = {
      status: 'ok',
      portfolios: portfoliosWithBalances,
    };

    await setRedisKey(redisKey, response, 20);

    res.status(200).json(response);
  })
);

portfoliosRouter.post(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { name, public: isPublic } = req.body as CreatePortfolioRequest;
    const userID = req.authContext!.uid;
    const redisKey = `portfoliolist-${userID}`;

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
      name: capitalize(name).trim(),
      createdAt: new Date(),
      settings: {
        defaultAssetType: AssetType.Stock,
        private: isPublic ? false : true,
        reminderEmailPeriod: Period.Weekly,
        summaryEmailPeriod: Period.Weekly,
      },
    };

    await newPortfolioDocRef.set(portfolioDataToSet, { merge: true });

    const response: CreatePortfolioResponse = {
      status: 'ok',
      portfolio: portfolioDataToSet,
    };

    await deleteRedisKey(redisKey);

    res.status(200).json(response);
  })
);

portfoliosRouter.get(
  '/:portfolioID',
  catchErrors(async (req, res) => {
    const redisKey = `portfolio-${req.params.portfolioID}`;

    let userOwnsPortfolio = false;

    const portfolio = await fetchDocument<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (portfolio.settings.private && !userOwnsPortfolio) {
      // Private portfolio
      return res.status(404).json({ status: 'error', error: 'Portfolio does not exist.' });
    }

    const cachedResponse = await getRedisKey(redisKey);

    if (cachedResponse) {
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    const positionsAndTotals = await calculatePortfolioQuotes(portfolio.id);

    const dailyBalances = await getPortfolioDailyHistory(portfolio.id);

    const response: GetPortfolioResponse = {
      status: 'ok',
      portfolio: {
        ...portfolio,
        ...positionsAndTotals,
        dailyBalances,
      },
    };

    await setRedisKey(redisKey, response, 12);

    res.status(200).json(response);
  })
);

export default portfoliosRouter;
