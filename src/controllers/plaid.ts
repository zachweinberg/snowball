import { Router } from 'express';
import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid';
import { catchErrors, requireSignedIn } from '~/utils/api';

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
      products: [Products.Auth],
      language: 'en',
      webhook: 'https://webhook.example.com',
      country_codes: [CountryCode.Us],
    };

    const createTokenResponse = await client.linkTokenCreate(plaidRequest);

    res.status(200).json({ status: 'ok', data: createTokenResponse.data });
  })
);

export default plaidRouter;
