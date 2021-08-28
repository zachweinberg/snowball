import { GetNewsResponse, NewsItem } from '@zachweinberg/wealth-schema';
import axios from 'axios';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';

const newsRouter = Router();

newsRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    let { symbol, page } = req.query as unknown as { symbol?: string; page: number };

    let baseURL = `https://stocknewsapi.com/api/v1/category?section=general&items=6&type=article&page=${page}&token=${process.env.STOCK_NEWS_API_KEY}`;

    if (symbol) {
      baseURL = `https://stocknewsapi.com/api/v1?tickers=${symbol}&items=6&type=article&page=${page}&token=${process.env.STOCK_NEWS_API_KEY}`;
    }

    const { data } = await axios.get(baseURL);

    const news: NewsItem[] = data.data.map((item) => ({
      date: item.date,
      imageURL: item.image_url,
      newsURL: item.news_url,
      sourceName: item.source_name,
      text: item.text,
      title: item.title,
    }));

    const response: GetNewsResponse = {
      status: 'ok',
      news,
    };

    res.status(200).json(response);
  })
);

export default newsRouter;
