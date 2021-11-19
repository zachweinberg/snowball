import { Router } from 'express';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid';
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

const client = new PlaidApi(plaidConfig);

plaidRouter.get(
  '/create-link-token',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const plaidRequest = {
      user: {
        client_user_id: userID,
      },
      client_name: 'Obsidian Tracker',
      products: [Products.Investments],
      language: 'en',
      webhook: 'https://api.obsidiantracker.com/plaid/webhooks',
      country_codes: [CountryCode.Us],
    };

    const createTokenResponse = await client.linkTokenCreate(plaidRequest);

    res.status(200).json({ status: 'ok', data: createTokenResponse.data });
  })
);

plaidRouter.post(
  '/exchange-public-token-and-fetch-holdings',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext?.uid!;
    const publicToken = req.body.publicToken;

    const tokenResponse = await client.itemPublicTokenExchange({
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

    const holdingsResponse = await client.investmentsHoldingsGet({
      access_token: accessToken,
    });

    const holdings = holdingsResponse.data.holdings;
    const securities = holdingsResponse.data.securities;

    const mappedHoldings = holdings.reduce((accum, holding) => {
      const theSecurity = securities.find((security) => security.security_id === holding.security_id);

      if (!theSecurity) {
        return accum;
      }

      // if (theSecurity.type === 'cash') {
      //   accum.push({
      //     name: theSecurity.name,
      //     type: AssetType.Cash,
      //   });
      // }

      return accum;
    }, []);

    console.log(holdings);
    console.log('----------------');
    console.log(securities);
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
