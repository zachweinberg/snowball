import {
  CheckEmailRequest,
  CheckEmailResponse,
  CreateUserRequest,
  CreateUserResponse,
  MeResponse,
  SendContactEmailRequest,
  User,
} from '@zachweinberg/obsidian-schema';
import { Router } from 'express';
import { sendContactRequestEmail } from '~/lib/email';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, fetchDocumentByID, findDocuments, updateDocument } from '~/utils/db';
import { capitalize } from '~/utils/misc';

const usersRouter = Router();

usersRouter.post(
  '/contact',
  catchErrors(async (req, res) => {
    const { name, email, message } = req.body as SendContactEmailRequest;

    const body = `
      Name: ${name}\n
      Return email: ${email ? email : 'None'}\n
      Message: ${message}\n
    `;

    await sendContactRequestEmail(body);

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
    const userID = req.authContext!.uid;

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

    const existingUsers = await findDocuments<User>('users', [
      { property: 'email', condition: '==', value: email.toLowerCase() },
    ]);

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
          email: email.toLowerCase(),
          emailVerified: false,
          password,
          displayName: capitalize(name).trim(),
          disabled: false,
        });

      const userDataToSet: User = {
        id: newUser.uid,
        email: email.toLowerCase(),
        name: capitalize(name).trim(),
        createdAt: new Date(),
      };

      await createDocument<User>('users', userDataToSet, newUser.uid);

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
    const userID = req.authContext!.uid;

    const email = req.body.newEmail;

    await firebaseAdmin().auth().updateUser(userID, {
      email: email.toLowerCase(),
    });

    await updateDocument('users', userID, { email: email.toLowerCase() });

    res.status(200).json({ status: 'ok' });
  })
);

usersRouter.put(
  '/change-password',
  requireSignedIn,
  catchErrors(async (req, res) => {
    const userID = req.authContext!.uid;

    const { newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ status: 'error', error: 'Passwords do not match.' });
    }

    await firebaseAdmin().auth().updateUser(userID, { password: confirmNewPassword });

    res.status(200).json({ status: 'ok' });
  })
);

export default usersRouter;
