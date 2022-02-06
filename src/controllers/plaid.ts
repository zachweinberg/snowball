import { AssetType, GetPlaidTokenResponse, PlaidItem, StockPosition } from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { Configuration, CountryCode, LinkTokenCreateRequest, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument } from '~/utils/db';

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

type TemporaryStockPosition = Omit<StockPosition, 'id' | 'createdAt'>;

plaidRouter.get(
  '/create-link-token',
  requireSignedIn,
  catchErrors(async (req, res) => {
    return res.status(200).end();
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
  '/items',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const { publicToken, institution, accounts } = req.body as {
      publicToken: string;
      institution: { name: string; institution_id: string };
      accounts: Array<{
        id: string;
        name: string;
        mask: string;
        type: string;
        subtype: string;
        verification_status: string;
      }>;
    };

    // exchange the public token for a private access token and store with the item.
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const plaidAccessToken = response.data.access_token;
    const plaidItemID = response.data.item_id;

    const plaidItem: PlaidItem = {
      userID,
      plaidInstitutionName: institution.name,
      plaidInstitutionID: institution.institution_id,
      plaidItemID,
      plaidAccessToken,
      createdAt: new Date(),
      status: 'GOOD',
    };

    await createDocument('plaid-items', plaidItem);

    // choose the  or savings account.
    const checkingAccounts = accounts.filter((account) => account.subtype === 'checking');
    const savingsAccounts = accounts.filter((account) => account.subtype === 'savings');
    const account = accounts.length === 1 ? accounts[0] : checkingAccounts.length > 0 ? checkingAccounts[0] : savingsAccounts[0];

    const balanceResponse = await plaidClient.accountsBalanceGet({
      access_token: plaidAccessToken,
      options: { account_ids: [account.id] },
    });

    console.log(JSON.stringify(balanceResponse.data));
    const plaidAccount = {
      plaidItemID,
      plaidAccountID: account.id,
      name: account.name,
      currentBalance: balanceResponse,
      type: '',
      subtype: '',
      userID,
    };

    await createDocument('plaid-accounts', {});
    res.status(200).end();

    // res.json({
    //   items: sanitizeItems(newItem),
    //   accounts: sanitizeAccounts(newAccount),
    // });
  })
);

plaidRouter.post(
  '/exchange-public-token-and-fetch-holdings',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;
    const publicToken = req.body.publicToken;

    const tokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = tokenResponse.data.access_token;
    const itemID = tokenResponse.data.item_id;

    await createDocument('plaid-items', {
      createdAt: new Date(),
      itemID,
      accessToken,
      userID,
    });

    const holdingsResponse = await plaidClient.investmentsHoldingsGet({
      access_token: accessToken,
    });

    const holdings = holdingsResponse.data.holdings;
    const securities = holdingsResponse.data.securities;

    const mappedHoldings: TemporaryStockPosition[] = holdings.reduce((accum, holding) => {
      const theSecurity = securities.find((security) => security.security_id === holding.security_id);

      if (!theSecurity) {
        return accum;
      }

      if (theSecurity.type === 'equity' && theSecurity.name && theSecurity.ticker_symbol && holding.cost_basis) {
        accum.push({
          companyName: theSecurity.name,
          symbol: theSecurity.ticker_symbol.toUpperCase(),
          assetType: AssetType.Stock,
          quantity: holding.quantity ?? 1,
          costPerShare: holding.cost_basis,
        });
      }

      return accum;
    }, [] as TemporaryStockPosition[]);

    // const response: {
    //   status: 'ok';
    // };

    res.status(200).json({ holdings, securities });
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
