import { AssetType, GetPlaidTokenResponse, PlaidAccount, PlaidItem, PlanType } from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { CountryCode, LinkTokenCreateRequest, Products } from 'plaid';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { plaidClient } from '~/lib/plaid';
import { deleteRedisKey } from '~/lib/redis';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { encrypt } from '~/utils/crypto';
import { createDocument, findDocuments } from '~/utils/db';
import { trackPortfolioLogItem } from '~/utils/logs';
import { formatMoneyFromNumber } from '~/utils/money';
import { userOwnsPortfolio } from '~/utils/portfolios';

const plaidRouter = Router();

interface NativePlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  verification_status: string;
}

const createPlaidLinkToken = async (userID: string, assetType: AssetType) => {
  const products = [Products.Auth];

  if (assetType === AssetType.Stock) {
    products.push(Products.Investments);
  }

  const plaidRequest: LinkTokenCreateRequest = {
    user: {
      client_user_id: userID,
    },
    redirect_uri: 'https://obsidiantracker.com/plaid/oauth-redirect',
    client_name: 'Obsidian Tracker',
    products,
    language: 'en',
    webhook: 'https://api.obsidiantracker.com/plaid/webhooks',
    country_codes: [CountryCode.Us],
  };

  const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);

  return createTokenResponse.data;
};

plaidRouter.get(
  '/create-link-token',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { assetType } = req.query as { assetType: AssetType };

    const data = await createPlaidLinkToken(userID, assetType);

    const response: GetPlaidTokenResponse = {
      status: 'ok',
      data,
    };

    res.status(200).json(response);
  })
);

plaidRouter.post(
  '/cash-item',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { publicToken, portfolioID, institutionID, institutionName, account } = req.body as {
      publicToken: string;
      institutionName: string;
      portfolioID: string;
      institutionID: string;
      account: NativePlaidAccount;
    };

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    const existingCashPositions = await findDocuments(`portfolios/${portfolioID}/positions`, [
      { property: 'assetType', condition: '==', value: AssetType.Cash },
    ]);

    if (existingCashPositions.length >= 4 && req.user!.plan?.type === PlanType.FREE) {
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

    // Exchange the public token for a private access token and store with the item
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const plaidAccessToken = exchangeResponse.data.access_token;
    const plaidItemID = exchangeResponse.data.item_id;

    const plaidItem: PlaidItem = {
      userID,
      plaidInstitutionName: institutionName,
      plaidInstitutionID: institutionID,
      plaidItemID,
      plaidAccessToken: encrypt(plaidAccessToken),
      createdAt: new Date(),
      status: 'GOOD',
      portfolioID,
      forAssetType: AssetType.Cash,
    };

    const newPositionDoc = await firebaseAdmin().firestore().collection(`portfolios/${portfolioID}/positions`).doc();

    const plaidAccount: PlaidAccount = {
      plaidItemID,
      forAssetType: AssetType.Cash,
      plaidAccountID: account.id,
      name: account.name,
      type: account.type ?? '',
      subtype: account.subtype ?? '',
      currentBalance: 0,
      userID,
      portfolioID,
      positionID: newPositionDoc.id,
      createdAt: new Date(),
    };

    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: plaidAccessToken,
    });

    const currentBalance =
      balanceResponse.data.accounts?.find((account) => account.account_id === plaidAccount.plaidAccountID)?.balances?.available ??
      0;

    plaidAccount.currentBalance = currentBalance;

    const accountName = `${plaidItem.plaidInstitutionName} - ${plaidAccount.name}`;

    await Promise.all([
      createDocument('plaid-accounts', plaidAccount, plaidAccount.plaidAccountID),
      createDocument('plaid-items', plaidItem, plaidItem.plaidItemID),
      newPositionDoc.set(
        {
          assetType: AssetType.Cash,
          isPlaid: true,
          plaidAccountID: plaidAccount.plaidAccountID,
          plaidItemID: plaidItem.plaidItemID,
          accountName,
          amount: currentBalance,
          createdAt: new Date(),
        },
        { merge: true }
      ),
    ]);

    const redisKey = `portfolio-${portfolioID}`;
    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    await trackPortfolioLogItem(
      portfolioID,
      `Added ${accountName} cash account (via Plaid) with ${formatMoneyFromNumber(currentBalance)}.`
    );

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

plaidRouter.post(
  '/stock-item',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { publicToken, portfolioID, institutionID, institutionName, account } = req.body as {
      publicToken: string;
      institutionName: string;
      portfolioID: string;
      institutionID: string;
      account: NativePlaidAccount;
    };

    if (!(await userOwnsPortfolio(req, res, portfolioID))) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    // const existingStockPositions = await findDocuments(`portfolios/${portfolioID}/positions`, [
    //   { property: 'assetType', condition: '==', value: AssetType.Stock },
    // ]);

    // if (existingStockPositions.length >= 4 && req.user!.plan?.type === PlanType.FREE) {
    //   return res.status(400).json({
    //     status: 'error',
    //     error:
    //       'Your account is currently on the free plan. If you would like to add more than four cash positions per portfolio, please upgrade to the premium plan.',
    //     code: 'PLAN',
    //   });
    // }

    // if (existingStockPositions.length >= 30) {
    //   return res.status(400).json({
    //     status: 'error',
    //     error: 'At this time, we allow up to 30 cash positions in a portfolio.',
    //     code: 'MAX_PLAN',
    //   });
    // }

    // Exchange the public token for a private access token and store with the item
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });
    console.log(exchangeResponse.data);
    const plaidAccessToken = exchangeResponse.data.access_token;
    const plaidItemID = exchangeResponse.data.item_id;

    const holdingsResponse = await plaidClient.investmentsHoldingsGet({
      access_token: plaidAccessToken,
    });

    console.log(JSON.stringify(holdingsResponse.data));

    // await Promise.all([
    //   createDocument('plaid-accounts', plaidAccount, plaidAccount.plaidAccountID),
    //   createDocument('plaid-items', plaidItem, plaidItem.plaidItemID),
    //   newPositionDoc.set(
    //     {
    //       assetType: AssetType.Cash,
    //       isPlaid: true,
    //       plaidAccountID: plaidAccount.plaidAccountID,
    //       plaidItemID: plaidItem.plaidItemID,
    //       accountName,
    //       amount: currentBalance,
    //       createdAt: new Date(),
    //     },
    //     { merge: true }
    //   ),
    // ]);

    const redisKey = `portfolio-${portfolioID}`;
    await deleteRedisKey(redisKey);
    await deleteRedisKey(`portfoliolist-${userID}`); // Portfolio list

    // await trackPortfolioLogItem(
    //   portfolioID,
    //   `Added ${accountName} cash account (via Plaid) with ${formatMoneyFromNumber(currentBalance)}.`
    // );

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

plaidRouter.get(
  '/webhooks',
  catchErrors(async (req, res) => {
    console.log(JSON.stringify(req.query));
    res.status(200).end();
  })
);

plaidRouter.post(
  '/webhooks',
  catchErrors(async (req, res) => {
    console.log(JSON.stringify(req.body));
    res.status(200).end();
  })
);

export default plaidRouter;
