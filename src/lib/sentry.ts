import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

export const logSentryError = (err) => {
  return Sentry.captureException(err);
};
