import { AssetType, GetQuoteResponse } from '@zachweinberg/wealth-schema';
import { Router } from 'express';
import { getCryptoPrices } from '~/lib/cmc';
import { getStockPrices } from '~/lib/iex';
import { catchErrors, requireSignedIn } from '~/utils/api';

const positionsRouter = Router();

positionsRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const { type, symbol } = req.query as { type: AssetType; symbol: string };

    let latestPrice = 0;

    if (type === AssetType.Stock) {
      const response = await getStockPrices([symbol]);
      if (response[symbol]) {
        latestPrice = response[symbol].latestPrice;
      }
    } else if (type === AssetType.Crypto) {
      const response = await getCryptoPrices([symbol]);
      if (response[symbol]) {
        latestPrice = response[symbol].latestPrice;
      }
    }

    const response: GetQuoteResponse = {
      status: 'ok',
      symbol,
      latestPrice: Number(latestPrice.toFixed(2)),
    };

    res.status(200).json(response);
  })
);

export default positionsRouter;
