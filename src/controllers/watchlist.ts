import { AddWatchListItemRequest, AssetType, GetWatchListResponse, PlanType, WatchListItem } from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import _ from 'lodash';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, deleteDocument, findDocuments } from '~/utils/db';

const watchListRouter = Router();

watchListRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const watchListItems = await findDocuments<WatchListItem>(`watchlists/${userID}/assets`);

    const _stocks = watchListItems.filter((item) => item.assetType === AssetType.Stock);
    const _crypto = watchListItems.filter((item) => item.assetType === AssetType.Crypto);

    const stockPriceMap = await getStockPrices(_stocks.map((s) => s.symbol));
    const cryptoPriceMap = await getCryptoPrices(_crypto.map((s) => s.symbol));

    let stocks: WatchListItem[] = [];
    let crypto: WatchListItem[] = [];

    for (const stock of _stocks) {
      stocks.push({
        id: stock.id,
        assetType: AssetType.Stock,
        symbol: stock.symbol,
        latestPrice: stockPriceMap[stock.symbol]?.latestPrice ?? 0,
        changePercent: stockPriceMap[stock.symbol]?.changePercent ?? 0,
        changeDollars: stockPriceMap[stock.symbol]?.change ?? 0,
        createdAt: stock.createdAt,
        fullName: stock.fullName,
        marketCap: stockPriceMap[stock.symbol]?.marketCap,
      });
    }

    for (const coin of _crypto) {
      crypto.push({
        id: coin.id,
        assetType: AssetType.Crypto,
        symbol: coin.symbol,
        latestPrice: cryptoPriceMap[coin.symbol]?.latestPrice ?? 0,
        changePercent: cryptoPriceMap[coin.symbol]?.changePercent ?? 0,
        createdAt: coin.createdAt,
        fullName: coin.fullName,
        marketCap: cryptoPriceMap[coin.symbol]?.marketCap ?? 0,
        changeDollars:
          cryptoPriceMap[coin.symbol].latestPrice -
          cryptoPriceMap[coin.symbol].latestPrice / (1 + cryptoPriceMap[coin.symbol]?.changePercent),
      });
    }

    const response: GetWatchListResponse = {
      status: 'ok',
      stocks: _.orderBy(stocks, [(stock) => stock.symbol], ['asc']),
      crypto: _.orderBy(crypto, [(crypto) => crypto.symbol], ['asc']),
    };

    res.status(200).json(response);
  })
);

watchListRouter.post(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const existingItems = await findDocuments(`watchlists/${userID}/assets`, []);

    if (existingItems.length >= 6 && req.user!.plan.type === PlanType.FREE) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your account is currently on the free plan. If you would like to add more than six watchlist assets, please upgrade to the premium plan.',
        code: 'PLAN',
      });
    }

    const body = req.body as AddWatchListItemRequest;

    await createDocument(`watchlists/${userID}/assets`, {
      ...body,
      createdAt: new Date(),
    });

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

watchListRouter.delete(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const { itemID } = req.query as { itemID: string };

    if (!itemID) {
      return res.status(400).end();
    }

    await deleteDocument(`watchlists/${userID}/assets/${itemID}`);

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

export default watchListRouter;
