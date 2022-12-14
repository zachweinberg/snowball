import {
  AssetType,
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  DailyBalancesPeriod,
  EditPortfolioSettingsRequest,
  GetPortfolioDailyBalancesResponse,
  GetPortfolioResponse,
  GetPortfolioSettingsResponse,
  GetPortfoliosResponse,
  Period,
  PlaidAccount,
  PlaidItem,
  PlanType,
  PLAN_LIMITS,
  Portfolio,
  RealEstatePosition,
} from 'schema';
import { Router } from 'express';
import { sendPortfolioDeletedEmail } from '~/lib/email';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { plaidClient } from '~/lib/plaid';
import { deleteRedisKey, getRedisKey, setRedisKey } from '~/lib/redis';
import { catchErrors, getUserFromAuthHeader, requireSignedIn } from '~/utils/api';
import { decrypt } from '~/utils/crypto';
import { deleteCollection, deleteDocument, fetchDocumentByID, findDocuments, updateDocument } from '~/utils/db';
import { getPortfolioLogItems, trackPortfolioLogItem } from '~/utils/logs';
import { capitalize } from '~/utils/misc';
import { getPortfolioDailyHistory, userOwnsPortfolio } from '~/utils/portfolios';
import { calculatePortfolioQuotes, calculatePortfolioSummary } from '~/utils/positions';

const portfoliosRouter = Router();

portfoliosRouter.get(
  '/:portfolioID/settings',
  requireSignedIn,
  catchErrors(async (req, res) => {
    let userOwnsPortfolio = false;

    const portfolio = await fetchDocumentByID<Portfolio>('portfolios', req.params.portfolioID);

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
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { name, settings } = req.body as EditPortfolioSettingsRequest;
    const { private: _private, defaultAssetType, summaryEmailPeriod } = settings;
    const redisKey = `portfolio-${req.params.portfolioID}`;

    let userOwnsPortfolio = false;

    const portfolio = await fetchDocumentByID<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (!userOwnsPortfolio) {
      // Private portfolio
      return res.status(403).end();
    }

    const updateBody = {
      name,
      settings: {
        private: _private,
        defaultAssetType,

        summaryEmailPeriod,
      },
    };

    await updateDocument('portfolios', req.params.portfolioID, updateBody);

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${authUser!.uid}`);

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
    const userID = req.user!.id;
    const redisKey = `portfoliolist-${userID}`;

    const cachedResponse = await getRedisKey(redisKey);

    if (cachedResponse) {
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    const portfolios = await findDocuments<Portfolio>('portfolios', [{ property: 'userID', condition: '==', value: userID }]);

    if (portfolios.length === 0) {
      return res.status(200).json({ status: 'ok', portfolios: [] });
    }

    let portfoliosWithBalances: any[] = [];

    for (const portfolio of portfolios) {
      const [summary, dailyBalances] = await Promise.all([
        calculatePortfolioSummary(portfolio.id),
        getPortfolioDailyHistory(portfolio.id, 30),
      ]);

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
    const userID = req.user!.id;
    const redisKey = `portfoliolist-${userID}`;

    const existingPortfolios = await findDocuments<Portfolio>('portfolios', [
      { property: 'userID', condition: '==', value: userID },
    ]);

    if (existingPortfolios.length >= PLAN_LIMITS.portfolios.free && req.user!.plan?.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to create more than one portfolio, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    if (existingPortfolios.length >= PLAN_LIMITS.portfolios.premium) {
      return res.status(400).json({
        status: 'error',
        error: 'At this time, we allow up to four portfolios on the premium plan.',
        code: 'MAX_PLAN',
      });
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
        summaryEmailPeriod: Period.Weekly,
      },
    };

    await newPortfolioDocRef.set(portfolioDataToSet, { merge: true });

    const response: CreatePortfolioResponse = {
      status: 'ok',
      portfolio: portfolioDataToSet,
    };

    await deleteRedisKey(redisKey);

    await trackPortfolioLogItem(portfolioDataToSet.id, 'Portfolio created.');

    res.status(200).json(response);
  })
);

portfoliosRouter.get(
  '/:portfolioID',
  catchErrors(async (req, res) => {
    const redisKey = `portfolio-${req.params.portfolioID}`;

    let userOwnsPortfolio = false;

    const portfolio = await fetchDocumentByID<Portfolio>('portfolios', req.params.portfolioID);

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

    const response: GetPortfolioResponse = {
      status: 'ok',
      portfolio: {
        ...portfolio,
        ...positionsAndTotals,
      },
    };

    await setRedisKey(redisKey, response, 12);

    res.status(200).json(response);
  })
);

portfoliosRouter.get(
  '/:portfolioID/daily-balances',
  catchErrors(async (req, res) => {
    const { period } = req.query as unknown as { period: DailyBalancesPeriod };

    if (!period) {
      return res.status(400).end();
    }

    let userOwnsPortfolio = false;

    const portfolio = await fetchDocumentByID<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (portfolio.settings.private && !userOwnsPortfolio) {
      // Private portfolio
      return res.status(404).json({ status: 'error', error: 'Portfolio does not exist.' });
    }

    let numDaysOfHistory: number | undefined = undefined;

    switch (period) {
      case DailyBalancesPeriod.OneDay:
        numDaysOfHistory = 2;
        break;
      case DailyBalancesPeriod.OneWeek:
        numDaysOfHistory = 8;
        break;
      case DailyBalancesPeriod.OneMonth:
        numDaysOfHistory = 31;
        break;
      case DailyBalancesPeriod.SixMonths:
        numDaysOfHistory = 182;
        break;
      case DailyBalancesPeriod.OneYear:
        numDaysOfHistory = 366;
        break;
      default:
        break;
    }

    const dailyBalances = await getPortfolioDailyHistory(portfolio.id, numDaysOfHistory);

    const response: GetPortfolioDailyBalancesResponse = {
      status: 'ok',
      dailyBalances,
    };

    res.status(200).json(response);
  })
);

portfoliosRouter.get(
  '/logs/:portfolioID',
  catchErrors(async (req, res) => {
    let userOwnsPortfolio = false;

    const portfolio = await fetchDocumentByID<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser && portfolio.userID === authUser.uid) {
      userOwnsPortfolio = true;
    }

    if (portfolio.settings.private && !userOwnsPortfolio) {
      return res.status(404).json({ status: 'error', error: 'Portfolio does not exist.' });
    }

    const logItems = await getPortfolioLogItems(req.params.portfolioID);

    res.status(200).json({ status: 'ok', logItems });
  })
);

portfoliosRouter.delete(
  '/:portfolioID',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const portfolioID = req.params.portfolioID;

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const portfolio = await fetchDocumentByID<Portfolio>(`portfolios`, portfolioID);

    const redisKey = `portfolio-${portfolioID}`;

    await deletePortfolioDocs(portfolioID);
    await deleteRealEstatePositions(portfolioID);
    await deletePlaidAccounts(portfolioID);
    await deletePlaidItems(portfolioID);

    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${req.user!.id}`);

    res.status(200).json({ status: 'ok' });

    sendPortfolioDeletedEmail(req.user!.email, portfolio.name);
  })
);

// UTILS
const deletePortfolioDocs = async (portfolioID: string) => {
  console.log(`> Deleting portfolio docs for ${portfolioID}`);
  await Promise.all([
    deleteCollection(`portfolios/${portfolioID}/dailyBalances`),
    deleteCollection(`portfolios/${portfolioID}/positions`),
    deleteCollection(`portfolios/${portfolioID}/logs`),
    deleteDocument(`portfolios/${portfolioID}`),
  ]);
};

const deleteRealEstatePositions = async (portfolioID: string) => {
  console.log(`> Deleting real estate position docs for ${portfolioID}`);
  const realEstateDocs = await findDocuments<RealEstatePosition>('real-estate-positions', [
    { property: 'portfolioID', condition: '==', value: portfolioID },
  ]);
  await Promise.all(realEstateDocs.map((doc) => deleteDocument(`real-estate-positions/${doc.id}`)));
};

const deletePlaidAccounts = async (portfolioID: string) => {
  console.log(`> Deleting plaid account docs for ${portfolioID}`);
  const plaidAccounts = await findDocuments<PlaidAccount>('plaid-accounts', [
    { property: 'portfolioID', condition: '==', value: portfolioID },
  ]);
  await Promise.all(plaidAccounts.map((doc) => deleteDocument(`plaid-accounts/${doc.id}`)));
};

const deletePlaidItems = async (portfolioID: string) => {
  console.log(`> Deleting plaid item docs for ${portfolioID}`);
  const plaidItems = await findDocuments<PlaidItem>('plaid-items', [
    { property: 'portfolioID', condition: '==', value: portfolioID },
  ]);

  await Promise.all(
    plaidItems.map((doc) => {
      plaidClient.itemRemove({
        access_token: decrypt(doc.plaidAccessToken),
      });
    })
  );

  await Promise.all(plaidItems.map((doc) => deleteDocument(`plaid-items/${doc.id}`)));
};

export default portfoliosRouter;
