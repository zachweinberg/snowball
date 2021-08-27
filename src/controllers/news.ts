import { GetNewsResponse, NewsItem } from '@zachweinberg/wealth-schema';
import axios from 'axios';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';

const newsRouter = Router();

newsRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    let baseURL = `https://stocknewsapi.com/api/v1/category?section=general&items=10&token=${process.env.STOCK_NEWS_API_KEY}`;

    if (req.query.symbol) {
      baseURL = `https://stocknewsapi.com/api/v1?tickers=${req.query.symbol}&items=50&token=${process.env.STOCK_NEWS_API_KEY}`;
    }

    const { data } = await axios.get(baseURL);

    const news = data.data as NewsItem[];

    const response: GetNewsResponse = {
      status: 'ok',
      news,
    };

    res.status(200).json(response);
  })
);

export default newsRouter;
