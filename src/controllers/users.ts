import { CreateUserRequest, CreateUserResponse, MeResponse, User } from '@wealth/schema';
import { Router } from 'express';
import { firebaseAdmin } from '~/lib/firebaseAdmin';
import { catchErrors, requireSignedIn } from '~/utils/api';
import { createDocument, fetchDocument, findDocuments } from '~/utils/db';

const usersRouter = Router();

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
    const { email, investingExperienceLevel, name, password } = req.body as CreateUserRequest;

    const existingUsers = await findDocuments<User>('users', [
      { property: 'email', condition: '==', value: email },
    ]);

    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        error: 'User with that email already exists.',
      });
    }

    const newUser = await firebaseAdmin().auth().createUser({
      email,
      emailVerified: false,
      password,
      displayName: name,
      disabled: false,
    });

    const userDataToSet: User = {
      id: newUser.uid,
      email,
      investingExperienceLevel,
      name,
      createdAt: new Date(),
    };

    await createDocument('users', userDataToSet, newUser.uid);

    const response: CreateUserResponse = {
      status: 'ok',
      user: userDataToSet,
    };

    res.status(200).json(response);
  })
);

export default usersRouter;
