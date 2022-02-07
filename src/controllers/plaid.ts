import { AssetType, CashPosition, GetPlaidTokenResponse, PlaidItem, PlanType } from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { deleteRedisKey } from '~/lib/redis';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { encrypt } from '~/utils/crypto';
import { createDocument, findDocuments } from '~/utils/db';
import { trackPortfolioLogItem } from '~/utils/logs';
import { formatMoneyFromNumber } from '~/utils/money';
import { userOwnsPortfolio } from '~/utils/portfolios';

const plaidRouter = Router();

const plaidConfig = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV!],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
    },
  },
});

const plaidClient = new PlaidApi(plaidConfig);

interface NativePlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  verification_status: string;
}

plaidRouter.get(
  '/create-link-token',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const plaidRequest: LinkTokenCreateRequest = {
      user: {
        client_user_id: userID,
      },
      redirect_uri: 'https://obsidiantracker.com/plaid/oauth-redirect',
      client_name: 'Obsidian Tracker',
      products: [Products.Auth],
      language: 'en',
      webhook: 'https://api.obsidiantracker.com/plaid/webhooks',
      country_codes: [CountryCode.Us],
    };

    const createTokenResponse = await plaidClient.linkTokenCreate(plaidRequest);

    const response: GetPlaidTokenResponse = {
      status: 'ok',
      data: createTokenResponse.data,
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

    const usersPlaidItems = await findDocuments<PlaidItem>('plaid-items', [
      { property: 'userID', condition: '==', value: userID },
    ]);
    const alreadyLinked = usersPlaidItems.find((plaidItem) => plaidItem.plaidInstitutionID === institutionID);

    if (alreadyLinked) {
      return res.status(400).json({
        status: 'error',
        error:
          'You have already linked this financial institution to your account. Please delete any existing cash positions linked to this institution and try again.',
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
    };

    const plaidAccount = {
      plaidItemID,
      plaidAccountID: account.id,
      name: account.name,
      type: account.type ?? '',
      subtype: account.subtype ?? '',
      userID,
    };

    await Promise.all([
      createDocument('plaid-accounts', plaidAccount),
      createDocument('plaid-items', plaidItem, plaidItem.plaidItemID),
    ]);

    const redisKey = `portfolio-${portfolioID}`;

    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: plaidAccessToken,
    });

    const currentBalance =
      balanceResponse.data.accounts?.find((account) => account.account_id === plaidAccount.plaidAccountID)?.balances?.available ??
      0;
    const accountName = `${plaidItem.plaidInstitutionName} - ${plaidAccount.name}`;

    await createDocument<CashPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Cash,
      isPlaid: true,
      plaidAccountID: plaidAccount.plaidAccountID,
      plaidItemID: plaidItem.plaidItemID,
      accountName,
      amount: currentBalance,
      createdAt: new Date(),
    });

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

// plaidRouter.post(
//   '/exchange-public-token-and-fetch-holdings',
//   requireSignedIn,
//   catchErrors(async (req, res) => {
//     const userID = req.user!.id;
//     const publicToken = req.body.publicToken;

//     const tokenResponse = await plaidClient.itemPublicTokenExchange({
//       public_token: publicToken,
//     });

//     const accessToken = tokenResponse.data.access_token;
//     const itemID = tokenResponse.data.item_id;

//     await createDocument('plaid-items', {
//       createdAt: new Date(),
//       itemID,
//       accessToken,
//       userID,
//     });

//     const holdingsResponse = await plaidClient.investmentsHoldingsGet({
//       access_token: accessToken,
//     });

//     const holdings = holdingsResponse.data.holdings;
//     const securities = holdingsResponse.data.securities;

//     const mappedHoldings: TemporaryStockPosition[] = holdings.reduce((accum, holding) => {
//       const theSecurity = securities.find((security) => security.security_id === holding.security_id);

//       if (!theSecurity) {
//         return accum;
//       }

//       if (theSecurity.type === 'equity' && theSecurity.name && theSecurity.ticker_symbol && holding.cost_basis) {
//         accum.push({
//           companyName: theSecurity.name,
//           symbol: theSecurity.ticker_symbol.toUpperCase(),
//           assetType: AssetType.Stock,
//           quantity: holding.quantity ?? 1,
//           costPerShare: holding.cost_basis,
//         });
//       }

//       return accum;
//     }, [] as TemporaryStockPosition[]);

//     // const response: {
//     //   status: 'ok';
//     // };

//     res.status(200).json({ holdings, securities });
//   })
// );

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
