import { GetNewsResponse } from 'schema';
import axios from 'axios';
import * as chrono from 'chrono-node';
import { Router } from 'express';
import { catchErrors, requireSignedIn } from '~/utils/api';

const newsRouter = Router();

const formatDate = (dateStr: string): Date => {
  const splitted = dateStr.split(' ');
  const [, day, month, year, time, zone] = splitted;
  return chrono.parseDate(`${day.trim()} ${month.trim()} ${year.trim()} ${time.trim()} ${zone.trim()}`);
};

newsRouter.get(
  '/',
  requireSignedIn,
  catchErrors(async (req, res) => {
    let { query, page } = req.query as unknown as { query?: string; page: number };

    let baseURL = `https://stocknewsapi.com/api/v1/category?section=general&items=9&type=article&page=${page}&token=${process.env.STOCK_NEWS_API_KEY}`;

    if (query) {
      baseURL = `https://stocknewsapi.com/api/v1/category?section=alltickers&page=${page}&items=9&token=${
        process.env.STOCK_NEWS_API_KEY
      }&search=${query.split(' ').join('+')}`;
    }

    const { data } = await axios.get(baseURL);

    const news = data.data.map((item) => ({
      date: formatDate(item.date),
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
