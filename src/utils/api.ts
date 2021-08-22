import express from 'express';
import { auth } from 'firebase-admin';
import { firebaseAdmin } from '~/lib/firebaseAdmin';

export const ignoreFavicon = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.originalUrl.includes('favicon.ico')) {
    return res.status(204).end();
  }
  next();
};

export const catchErrors =
  (fn: express.RequestHandler) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

export const handleErrors = (error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error);

  const errorObject = {
    status: error.status ?? 500,
    code: error.code ?? 'Error',
    error: error.message ?? 'Something went wrong',
  };

  return res.status(errorObject.status).json(errorObject);
};

const getAuthorizationToken = (req: express.Request, required = true) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    if (required) {
      throw new Error('Auth header required');
    }
    return null;
  }

  const parts = authHeader.split(' ');

  if (parts.length < 2) {
    if (required) {
      throw new Error('Authorization header must be in the form "Bearer <token>"');
    }
    return null;
  }

  return parts[1];
};

const getUserFromAuthHeader = async (req: express.Request, required = true): Promise<auth.DecodedIdToken | null> => {
  const token = getAuthorizationToken(req, required);

  if (!token) {
    return null;
  }

  try {
    const decodedToken = await firebaseAdmin().auth().verifyIdToken(token);
    return decodedToken as auth.DecodedIdToken;
  } catch (err) {
    if (required) {
      throw err;
    }
    return null;
  }
};

export const requireSignedIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const authUser = await getUserFromAuthHeader(req, true);
    req.authContext = authUser as auth.DecodedIdToken;
    next();
  } catch (err) {
    Object.defineProperty(err, 'status', { value: 403 });
    Object.defineProperty(err, 'code', { value: 'permission-denied' });
    next(err);
  }
};
