import { Portfolio } from '@zachweinberg/wealth-schema';
import { fetchDocument } from './db';

export const userOwnsPortfolio = async (req, res, portfolioID) => {
  const userID = req.authContext!.uid;

  const portfolio = await fetchDocument<Portfolio>('portfolios', portfolioID);

  if (portfolio.userID !== userID) {
    return false;
  }

  return true;
};
