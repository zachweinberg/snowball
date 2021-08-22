import * as firebaseAdmin from 'firebase-admin';

declare global {
  namespace Express {
    interface Request {
      authContext?: firebaseAdmin.auth.DecodedIdToken;
    }
  }
}
