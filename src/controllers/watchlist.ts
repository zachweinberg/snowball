import { AddWatchListItemRequest, AssetType, GetWatchListResponse, WatchListItem } from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, findDocuments } from '~/utils/db';
import { reversePercentage } from '~/utils/math';

const watchListRouter = Router();

watchListRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const watchListItems = await findDocuments<WatchListItem>(`watchlists/${userID}/assets`);

    const _stocks = watchListItems.filter((item) => item.assetType === AssetType.Stock);
    const _crypto = watchListItems.filter((item) => item.assetType === AssetType.Crypto);

    const stockPriceMap = await getStockPrices(_stocks.map((s) => s.symbol));
    const cryptoPriceMap = await getCryptoPrices(_crypto.map((s) => s.symbol));

    let stocks: WatchListItem[] = [];
    let crypto: WatchListItem[] = [];

    for (const stock of _stocks) {
      stocks.push({
        assetType: AssetType.Stock,
        symbol: stock.symbol,
        latestPrice: stockPriceMap[stock.symbol]?.latestPrice ?? 0,
        changePercent: stockPriceMap[stock.symbol]?.changePercent ?? 0,
        changeDollars: stockPriceMap[stock.symbol]?.change ?? 0,
        dateAdded: stock.dateAdded,
        fullName: stock.fullName,
      });
    }

    for (const coin of _crypto) {
      crypto.push({
        assetType: AssetType.Crypto,
        symbol: coin.symbol,
        latestPrice: cryptoPriceMap[coin.symbol]?.latestPrice ?? 0,
        changePercent: cryptoPriceMap[coin.symbol]?.changePercent ?? 0,
        dateAdded: coin.dateAdded,
        fullName: coin.fullName,
        changeDollars: reversePercentage(
          cryptoPriceMap[coin.symbol]?.latestPrice ?? 0,
          cryptoPriceMap[coin.symbol]?.changePercent ?? 0
        ),
      });
    }

    const response: GetWatchListResponse = {
      status: 'ok',
      stocks,
      crypto,
    };

    res.status(200).json(response);
  })
);

watchListRouter.post(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const body = req.body as AddWatchListItemRequest;

    await createDocument(`watchlists/${userID}/assets`, {
      ...body,
      dateAdded: new Date(0),
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

export default watchListRouter;
