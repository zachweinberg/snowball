import { AddStockRequest, AssetType, Portfolio, StockPosition } from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, fetchDocument } from '~/utils/db';

const positionsRouter = Router();

positionsRouter.post(
  '/stock',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { portfolioID, symbol, companyName, quantity, costBasis, note } =
      req.body as AddStockRequest;

    const userID = req.authContext!.uid;

    const portfolio = await fetchDocument<Portfolio>('portfolios', portfolioID);

    if (portfolio.userID !== userID) {
      return res.status(401).json({ status: 'error', error: 'Invalid.' });
    }

    await createDocument<StockPosition>(`portfolios/${portfolioID}/positions`, {
      assetType: AssetType.Stock,
      companyName,
      costBasis,
      quantity,
      symbol: symbol.toUpperCase(),
      createdAt: new Date(),
      note: note ? note : '',
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

export default positionsRouter;
