import cors from 'cors';
import express from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import portfoliosRouter from '~/controllers/portfolios';
import usersRouter from '~/controllers/users';
import { handleErrors, ignoreFavicon } from '~/utils/api';
import positionsRouter from './controllers/positions';

const app = express();
const PORT = process.env.PORT || 8080;
let server: http.Server | null = null;

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
