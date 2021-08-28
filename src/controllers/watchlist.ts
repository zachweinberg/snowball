import { AssetType, GetWatchListResponse, WatchListItem } from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { findDocuments } from '~/utils/db';

const watchListRouter = Router();

watchListRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const watchListItems = await findDocuments<WatchListItem>(`watchlists/${userID}/assets`);

    const stocks = watchListItems.map((item) => item.assetType === AssetType.Stock);
    const crypto = watchListItems.map((item) => item.assetType === AssetType.Crypto);

    const response: GetWatchListResponse = {
      status: 'ok',
      stocks,
      crypto,
    };

    res.status(200).json(response);
  })
);

export default watchListRouter;
