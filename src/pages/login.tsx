import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Button from '~/components/Button';
import TextInput from '~/components/form/TextInput';
import Typography from '~/components/Typography';

const LoginPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-lg p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl">
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
              Need an account?
            </Typography>
            <Link href="/signup">
              <Typography element="a" variant="Link" className="ml-2 ">
                Sign Up
              </Typography>
            </Link>
          </div>
        </div>

        <div className="mb-10">
          <Typography element="h1" variant="Headline1" className="text-dark">
            Check out how your
            <br />
            Net Worth has changed.
          </Typography>
        </div>

        <div className="mb-5">
          <TextInput name="email" placeholder="Email address" type="email" className="mb-4" />
          <TextInput name="password" placeholder="Password" type="password" />
        </div>

        <div className="flex justify-between mb-20">
          <div>
            <Typography element="p" variant="Paragraph">
              Keep me signed in
            </Typography>
          </div>
          <div>
            <Link href="/reset-password">
              <Typography element="a" variant="Link">
                Forgot Password
              </Typography>
            </Link>
          </div>
        </div>

        <div className="mb-16">
          <Button type="submit">Log in to my account</Button>
        </div>
      </div>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
