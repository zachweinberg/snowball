import { AssetType, GetQuoteResponse } from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { catchErrors, requireSignedIn } from '~/utils/api';

const quotesRouter = Router();

quotesRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { type, symbol } = req.query as { type: AssetType; symbol: string };

    let latestPrice = 0;
    let changePercent = 0;

    if (type === AssetType.Stock) {
      const response = await getStockPrices([symbol]);
      if (response[symbol]) {
        latestPrice = response[symbol].latestPrice;
        changePercent = response[symbol].changePercent;
      }
    } else if (type === AssetType.Crypto) {
      const response = await getCryptoPrices([symbol]);
      if (response[symbol]) {
        latestPrice = response[symbol].latestPrice;
        changePercent = response[symbol].changePercent;
      }
    }

    const response: GetQuoteResponse = {
      status: 'ok',
      symbol,
      latestPrice: Number(latestPrice),
      changePercent: Number(changePercent),
      changeDollars: Number((1 + changePercent) * latestPrice),
    };

    res.status(200).json(response);
  })
);

export default quotesRouter;
