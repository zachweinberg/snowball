import { DailyBalance, Portfolio } from '@zachweinberg/obsidian-schema';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { fetchDocumentByID } from './db';

export const userOwnsPortfolio = async (req, res, portfolioID) => {
  const userID = req.authContext!.uid;

  const portfolio = await fetchDocumentByID<Portfolio>('portfolios', portfolioID);

  if (portfolio.userID !== userID) {
    return false;
  }

  return true;
};

export const getPortfolioDailyHistory = async (portfolioID: string, numDays?: number): Promise<DailyBalance[]> => {
  let snapshotQuery = await firebaseAdmin()
    .firestore()
    .collection(`portfolios/${portfolioID}/dailyBalances`)
    .orderBy('date', 'asc');

  if (numDays) {
    snapshotQuery = snapshotQuery.limit(numDays);
  }

  const snapshots = await snapshotQuery.get();

  return snapshots.docs.map((d) => d.data()) as DailyBalance[];
};
