import { InvestingExperienceLevel } from '@zachweinberg/wealth-schema';
import classNames from 'classnames';
import type { NextPage } from 'next';
import React, { useState } from 'react';
import * as yup from 'yup';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Button from '~/components/Button';
import TextInput from '~/components/form/TextInput';
import Link from '~/components/Link';
import Typography from '~/components/Typography';
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
          investingExperienceLevel: InvestingExperienceLevel.LessThanOneYear,
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
      <form
        onSubmit={onSubmit}
        className={classNames('max-w-lg p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl', {
          'bg-opacity-70': loading,
        })}
      >
        <div className="flex justify-between mb-20">
          <svg
            width="30"
            viewBox="0 0 32 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-current text-dark"
          >
            <path d="M26.3705 9.57589C26.567 9.03571 26.7143 8.49553 26.7143 7.85714C26.7143 5.25446 24.6027 3.14286 22 3.14286C21.0179 3.14286 20.0848 3.4375 19.3482 3.97768C18.0223 1.62054 15.4688 0 12.5714 0C8.20089 0 4.71429 3.53571 4.71429 7.85714C4.71429 8.00446 4.71429 8.15178 4.71429 8.29911C1.96429 9.23214 0 11.8839 0 14.9286C0 18.8571 3.14286 22 7.07143 22H25.1429C28.5804 22 31.4286 19.2009 31.4286 15.7143C31.4286 12.7187 29.2679 10.1652 26.3705 9.57589Z" />
          </svg>
          <div className="flex">
            <Typography element="p" variant="Button" className="text-darkgray">
              Already have an account?
            </Typography>
            <Link href="/login">
              <Typography
                element="div"
                variant="Link"
                className="ml-2 underline text-evergreen"
              >
                Login
              </Typography>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <Typography element="h1" variant="Headline1" className="mb-2 text-dark">
            Create an account
          </Typography>
          <Typography element="p" variant="Paragraph">
            Sign up below to start tracking your assets and amplify your financial experience.
          </Typography>
        </div>

        <div className="mb-10">
          <TextInput
            name="name"
            placeholder="Your name"
            required
            type="text"
            className="mb-4"
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            name="email"
            placeholder="Email address"
            type="email"
            required
            className="mb-4"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            name="password"
            placeholder="Password"
            type="password"
            className="mb-4"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextInput
            name="confirmPassword"
            placeholder="Confirm password"
            required
            type="password"
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <div className="flex justify-between mb-10">
          <div>
            <Typography element="p" variant="Paragraph">
              Keep me signed in
            </Typography>
          </div>
          <div>
            <Link href="/reset-password">
              <Typography element="div" variant="Link" className="underline text-evergreen">
                Forgot Password
              </Typography>
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

export default SignUpPage;
