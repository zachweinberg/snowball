import classNames from 'classnames';
import { trackGoal } from 'fathom-client';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import * as yup from 'yup';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
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

    trackGoal('DC185KX6', 0);

    const isValid = await loginSchema.isValid({
      email,
      password,
    });

    if (isValid) {
      setLoading(true);
      try {
        await auth.login(email, password);
      } catch (err) {
        trackGoal('BRCO10IY', 0);
        if (err.code === 'auth/user-not-found') {
          setError('An account with that email and password could not be found.');
        } else if (err.code === 'auth/wrong-password') {
          setError('Invalid email or password.');
        } else {
          setError('Invalid email or password.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <RequiredLoggedOut>
      <Layout title="Login | Obsidian Tracker">
        <form
          className={classNames(
            'max-w-lg border border-bordergray p-8 mx-auto mb-16 mt-10 bg-white shadow-md rounded-2xl',
            {
              'opacity-70': loading,
            }
          )}
          onSubmit={onSubmit}
        >
          <div className="flex items-center justify-between mb-10">
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
              net worth has changed.
            </h1>
          </div>

          <div className="mb-5">
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

          {error && <p className="mb-5 font-medium text-center text-red">{error}</p>}

          <div className="flex justify-center mb-5">
            <div>
              <Link href="/reset-password">
                <span className="underline text-evergreen font-medium text-[1rem] hover:opacity-80">
                  Forgot Password?
                </span>
              </Link>
            </div>
          </div>

          <div className="mb-16">
            <Button type="submit" disabled={loading}>
              Log in to my account
            </Button>
          </div>
        </form>
      </Layout>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
