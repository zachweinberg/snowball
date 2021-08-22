import {
  CreatePortfolioRequest,
  CreatePortfolioResponse,
  GetPortfoliosResponse,
  Portfolio,
  PortfolioWithBalances,
  Position,
} from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { catchErrors, getUserFromAuthHeader, requireSignedIn } from '~/utils/api';
import { fetchDocument, findDocuments } from '~/utils/db';
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

      portfoliosWithBalances.push({
        ...portfolio,
        totalValue: 0,
        totalPercentChange: 42.42,
        customsValue: 3,
        stocksValue: 42,
        realEstateValue: 52,
        cryptoValue: 987,
        cashValue: 12,
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
    let userDoesNotOwnPortfolio = true;

    const portfolio = await fetchDocument<Portfolio>('portfolios', req.params.portfolioID);

    const authUser = await getUserFromAuthHeader(req, false);

    if (authUser) {
      const usersPortfolios = await findDocuments<Portfolio>('portfolios', [
        { property: 'userID', condition: '==', value: authUser.uid },
      ]);

      if (usersPortfolios.some((portfolio) => portfolio.id === req.params.portfolioID)) {
        userDoesNotOwnPortfolio = false;
      }
    }

    if (!portfolio.public && userDoesNotOwnPortfolio) {
      return res.status(404).json({ status: 'error', error: 'Portfolio does not exist.' });
    }

    res.status(200).json({ status: 'ok', portfolio });
  })
);

export default portfoliosRouter;
