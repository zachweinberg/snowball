import cors from 'cors';
import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import RateLimit from 'express-rate-limit';
import http from 'http';
import Redis from 'ioredis';
import morgan from 'morgan';
import path from 'path';
import RedisStore from 'rate-limit-redis';
import portfoliosRouter from '~/controllers/portfolios';
import usersRouter from '~/controllers/users';
import { handleErrors, ignoreFavicon } from '~/utils/api';
import alertsRouter from './controllers/alerts';
import newsRouter from './controllers/news';
import plaidRouter from './controllers/plaid';
import positionsRouter from './controllers/positions';
import quotesRouter from './controllers/quotes';
import watchListRouter from './controllers/watchlist';

const app = express();
const PORT = process.env.PORT || 8080;
let server: http.Server | null = null;

const limiter = RateLimit({
  windowMs: 15000,
  store: new RedisStore({
    expiry: 15,
    prefix: 'ratelimiter',
    client: new Redis(process.env.REDIS_URL!, { tls: { rejectUnauthorized: false } }),
  }),
  max: 20,
});

app.use(limiter);
app.use(express.json({ limit: '5mb' }));
app.use(cors());
app.use(ignoreFavicon);
app.use(morgan('tiny'));

const apiSpec = path.join(__dirname, '..', 'schema', 'openapi.yaml');

const Server = {
  start: async () => {
    try {
      app.use(
        OpenApiValidator.middleware({
          apiSpec,
          validateRequests: true,
          validateResponses: false,
        })
      );

      app.use('/api/users', usersRouter);
      app.use('/api/portfolios', portfoliosRouter);
      app.use('/api/positions', positionsRouter);
      app.use('/api/quotes', quotesRouter);
      app.use('/api/news', newsRouter);
      app.use('/api/watchlist', watchListRouter);
      app.use('/api/alerts', alertsRouter);
      app.use('/api/plaid', plaidRouter);
      app.use(handleErrors);

      server = app.listen(PORT, () => {
        console.log(`- SERVER LIVE ON PORT ${PORT} -`);
      });
    } catch (err) {
      console.error(err);
      setTimeout(() => process.exit(1), 4000);
    }
  },
  stop: () =>
    new Promise((resolve) => {
      server?.close(resolve);
    }),
};

if (process.env.NODE_ENV !== 'test') {
  Server.start();
}

export default Server;
