import classNames from 'classnames';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import * as yup from 'yup';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Layout from '~/components/layout/Layout';
import Button from '~/components/ui/Button';
import Link from '~/components/ui/Link';
import Logo from '~/components/ui/Logo';
import TextInput from '~/components/ui/TextInput';
import { useAuth } from '~/hooks/useAuth';

const signupSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name is too short.')
    .max(40, 'Name is too long.')
    .required('Name is required.'),
  email: yup.string().email().required('Email is required.'),
  password: yup.string().required('Password is required.'),
  passwordConfirm: yup.string().required(),
});

const SignUpPage: NextPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (passwordConfirm !== password) {
      setError('Passwords must match.');
      return;
    }

    let isValid = false;

    try {
      await signupSchema.validate({
        name,
        email,
        password,
        passwordConfirm,
      });
      isValid = true;
    } catch (err) {
      setError(err.errors?.[0] ?? '');
    }

    if (isValid) {
      setLoading(true);
      try {
        await auth.signup({
          email,
          name,
          password,
        });
      } catch (err) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (err.code === 'auth/weak-password') {
          setError('Please use a stronger password.');
        } else if (err.code === 'auth/email-already-in-use') {
          setError('An account already exists with this email address.');
        } else {
          setError('Something went wrong.');
        }
        setLoading(false);
      }
    }
  };

  return (
    <RequiredLoggedOut>
      <Layout title="Signup | Obsidian Tracker">
        <form
          onSubmit={onSubmit}
          className={classNames(
            'max-w-lg border border-bordergray p-8 mx-auto mb-16 mt-10 bg-white shadow-md rounded-2xl',
            {
              'bg-opacity-70': loading,
            }
          )}
        >
          <div className="flex justify-between mb-20">
            <Logo />
            <div className="flex font-semibold text-[1rem]">
              <p className="text-darkgray">Already have an account?</p>
              <Link href="/login">
                <span className="ml-2 underline text-evergreen hover:opacity-80">Login</span>
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-dark font-bold text-[1.75rem] leading-tight mb-3">
              Create an account
            </h1>
            <p className="font-medium text-[1.1rem] text-darkgray leading-snug">
              Sign up below to start tracking your assets and amplify your financial
              experience.
            </p>
          </div>

          <div className="mb-5">
            <TextInput
              name="name"
              placeholder="Your name"
              value={name}
              required
              type="text"
              className="mb-4"
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              name="email"
              value={email}
              placeholder="Email address"
              type="email"
              required
              className="mb-4"
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              name="password"
              value={password}
              placeholder="Password"
              type="password"
              className="mb-4"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextInput
              value={passwordConfirm}
              name="confirmPassword"
              placeholder="Confirm password"
              required
              type="password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {error && <p className="mb-5 font-medium text-center text-red">{error}</p>}

          <div className="mb-16">
            <Button type="submit" disabled={loading}>
              Create account
            </Button>
          </div>
        </form>
      </Layout>
    </RequiredLoggedOut>
  );
};

export default SignUpPage;
