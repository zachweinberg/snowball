import { Router } from 'express';
import {
  Alert,
  CheckEmailRequest,
  CheckEmailResponse,
  CreateUserRequest,
  CreateUserResponse,
  MeResponse,
  PlanType,
  Portfolio,
  SendContactEmailRequest,
  User,
} from 'schema';
import { newUserEmail, sendAccountDeletedEmail, sendContactRequestEmail, sendWelcomeEmail } from '~/lib/email';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { deleteRedisKey } from '~/lib/redis';
import { logSentryError } from '~/lib/sentry';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, deleteCollection, deleteDocument, fetchDocumentByID, findDocuments, updateDocument } from '~/utils/db';
import { capitalize } from '~/utils/misc';

const usersRouter = Router();

usersRouter.post(
  '/contact',
  catchErrors(async (req, res) => {
    const { name, email, message } = req.body as SendContactEmailRequest;

    await sendContactRequestEmail(name, message, email);

    const response = {
      status: 'ok',
    };

    res.status(200).json(response);
  })
);

usersRouter.get(
  '/me',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const user = await fetchDocumentByID<User>('users', userID);

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

    const userEmail = email.toLowerCase();
    const userName = capitalize(name).trim();

    const existingUsers = await findDocuments<User>('users', [{ property: 'email', condition: '==', value: userEmail }]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'A user with that email already exists.',
      });
    }

    try {
      const newUser = await firebaseAdmin().auth().createUser({
        email: userEmail,
        emailVerified: false,
        password,
        displayName: userName,
        disabled: false,
      });

      const userDataToSet: User = {
        id: newUser.uid,
        email: userEmail,
        lastLogin: new Date(),
        name: userName,
        createdAt: new Date(),
        plan: {
          type: PlanType.FREE,
          stripeCustomerID: null,
          stripeSubscriptionID: null,
          planUpdatedAt: new Date(),
        },
      };

      await createDocument<User>('users', userDataToSet, newUser.uid);

      try {
        await sendWelcomeEmail(email, userName);
        await newUserEmail(userEmail, userName);
      } catch (err) {
        console.error(err);
        logSentryError(err);
      }

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
    const { email } = req.body as CheckEmailRequest;

    const existingUsers = await findDocuments<User>('users', [
      { property: 'email', condition: '==', value: email.toLowerCase() },
    ]);

    if (existingUsers.length === 0) {
      return res.status(404).json({ status: 'error', error: 'Invalid email or password.' });
    }

    const response: CheckEmailResponse = {
      status: 'ok',
      email,
    };

    res.status(200).json(response);
  })
);

usersRouter.put(
  '/update-email',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const userEmail = req.body.newEmail.toLowerCase();

    await firebaseAdmin().auth().updateUser(userID, {
      email: userEmail,
    });

    await updateDocument('users', userID, { email: userEmail });

    res.status(200).json({ status: 'ok' });
  })
);

usersRouter.put(
  '/change-password',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ status: 'error', error: 'Passwords do not match.' });
    }

    await firebaseAdmin().auth().updateUser(userID, { password: confirmNewPassword });

    res.status(200).json({ status: 'ok' });
  })
);

usersRouter.delete(
  '/delete',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.user!.id;

    if (req.user!.plan?.type === PlanType.PREMIUM) {
      return res.status(400).json({
        status: 'error',
        error:
          'Your premium subscription is still active. Please cancel it on the account settings page before deleting your account.',
      });
    }

    const usersPortfolios = await findDocuments<Portfolio>('portfolios', [
      { property: 'userID', condition: '==', value: userID },
    ]);

    if (usersPortfolios.length > 0) {
      return res
        .status(400)
        .json({ status: 'error', error: 'Please delete all of your portfolios before deleting your account.' });
    }

    await deleteWatchListItems(userID);
    await deletePriceAlerts(userID);
    await firebaseAdmin().auth().deleteUser(userID);
    await deleteDocument(`users/${userID}`);

    await deleteRedisKey(`portfoliolist-${userID}`);

    res.status(200).json({ status: 'ok' });

    sendAccountDeletedEmail(req.user!.email);
  })
);

// UTILS
const deleteWatchListItems = async (userID: string) => {
  console.log(`> Deleting watchlist items for user ${userID}`);
  await deleteCollection(`watchlists/${userID}/assets`);
};

const deletePriceAlerts = async (userID: string) => {
  console.log(`> Deleting price alerts for user ${userID}`);
  const priceAlerts = await findDocuments<Alert>('alerts', [{ property: 'userID', condition: '==', value: userID }]);
  await Promise.all(priceAlerts.map((alert) => deleteDocument(`alerts/${alert.id}`)));
};

export default usersRouter;
