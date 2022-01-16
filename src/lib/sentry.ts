import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

export const logSentryError = (err) => {
  if (process.env.NODE_ENV === 'production') {
    return Sentry.captureException(err);
  }
};
