import {
  CheckVerificationTokenRequest,
  CheckVerificationTokenResponse,
  CreateUserRequest,
  CreateUserResponse,
  MeResponse,
  User,
  VerifyEmailRequest,
  VerifyEmailResponse,
} from '@zachweinberg/obsidian-schema';
import crypto from 'crypto';
import { Router } from 'express';
import { firestore } from 'firebase-admin';
import { sendVerifyEmailEmail } from '~/lib/email';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, fetchDocument, findDocuments, updateDocument } from '~/utils/db';
import { capitalize } from '~/utils/misc';

const usersRouter = Router();

const generateVerificationToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(46, (err, buf) => {
      if (err) {
        return reject(err);
      }
      return resolve(buf.toString('hex'));
    });
  });
};

usersRouter.get(
  '/me',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const user = await fetchDocument<User>('users', userID);

    const response: MeResponse = {
      status: 'ok',
      me: user,
    };

    res.status(200).json(response);
  })
);

usersRouter.post(
  '/',
  catchErrors(async (req, res) => {
    const { email, name, password } = req.body as CreateUserRequest;

    const existingUsers = await findDocuments<User>('users', [{ property: 'email', condition: '==', value: email }]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'User with that email already exists.',
      });
    }

    try {
      const newUser = await firebaseAdmin()
        .auth()
        .createUser({
          email,
          emailVerified: false,
          password,
          displayName: capitalize(name).trim(),
          disabled: false,
        });

      const verificationCode = await generateVerificationToken();

      const userDataToSet: User = {
        id: newUser.uid,
        email,
        name: capitalize(name).trim(),
        createdAt: new Date(),
        verified: false,
        verificationCode,
      };

      await createDocument<User>('users', userDataToSet, newUser.uid);

      await sendVerifyEmailEmail(email, verificationCode, newUser.uid);

      const response: CreateUserResponse = {
        status: 'ok',
        user: userDataToSet,
      };

      res.status(200).json(response);
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        return res.status(400).json({ status: 'error', error: 'An account with that email already exists.' });
      }
      if (err.code === 'auth/invalid-password') {
        return res.status(400).json({ status: 'error', error: 'Please use a stronger password.' });
      }

      throw err;
    }
  })
);

usersRouter.post(
  '/check',
  catchErrors(async (req, res) => {
    const { email } = req.body as VerifyEmailRequest;

    const existingUsers = await findDocuments<User>('users', [{ property: 'email', condition: '==', value: email }]);

    if (existingUsers.length === 0) {
      return res.status(404).json({ status: 'error', error: 'Invalid email or password.' });
    }

    const response: VerifyEmailResponse = {
      status: 'ok',
      email,
    };

    res.status(200).json(response);
  })
);

usersRouter.post(
  '/resend-email',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const verificationCode = await generateVerificationToken();

    const user = await fetchDocument<User>('users', userID);

    await updateDocument('users', userID, { verificationCode });

    await sendVerifyEmailEmail(user.email, verificationCode, userID);

    res.status(200).end();
  })
);

usersRouter.post(
  '/check-verification-token',
  catchErrors(async (req, res) => {
    const { token, userID } = req.body as CheckVerificationTokenRequest;

    const user = await fetchDocument<User>('users', userID);

    const response: CheckVerificationTokenResponse = { verified: false, status: 'ok' };

    if (user.verified) {
      throw new Error('Already verified');
    }

    if (token === user.verificationCode) {
      await updateDocument('users', userID, { verified: true, verificationCode: firestore.FieldValue.delete() });
      response.verified = true;
    } else {
      response.verified = false;
    }

    res.status(200).json(response);
  })
);

export default usersRouter;
