import classNames from 'classnames';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import * as yup from 'yup';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Button from '~/components/ui/Button';
import Cloud from '~/components/ui/Cloud';
import Link from '~/components/ui/Link';
import TextInput from '~/components/ui/TextInput';
import { useAuth } from '~/hooks/useAuth';

const loginSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const LoginPage: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    const isValid = await loginSchema.isValid({
      email,
      password,
    });

    if (isValid) {
      setLoading(true);
      try {
        await auth.login(email, password);
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          setError('An account with that email and password could not be found.');
        } else if (err.code === 'auth/wrong-password') {
          setError('Invalid email or password.');
        } else {
          setError('Something went wrong.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <RequiredLoggedOut>
      <form
        className={classNames(
          'max-w-lg border border-bordergray p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl',
          {
            'opacity-70': loading,
          }
        )}
        onSubmit={onSubmit}
      >
        <div className="flex justify-between mb-20">
          <Cloud />
          <div className="flex font-semibold text-[1rem]">
            <p className="text-darkgray">Need an account?</p>
            <Link href="/signup">
              <span className="ml-2 underline text-evergreen hover:opacity-80">Sign Up</span>
            </Link>
          </div>
        </div>

        <div className="mb-10">
          <h1 className="text-dark font-bold text-[1.75rem] leading-tight">
            Check out how your
            <br />
            Net Worth has changed.
          </h1>
        </div>

        <div className="mb-10">
          <TextInput
            name="email"
            value={email}
            required
            placeholder="Email address"
            type="email"
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            name="password"
            value={password}
            required
            placeholder="Password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end mb-10">
          <div>
            <Link href="/reset-password">
              <span className="underline text-evergreen font-semibold text-[1rem] hover:opacity-80">
                Forgot Password?
              </span>
            </Link>
          </div>
        </div>

        {error && <p className="mb-10 text-red">{error}</p>}

        <div className="mb-16">
          <Button type="submit" disabled={loading}>
            Log in to my account
          </Button>
        </div>
      </form>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
