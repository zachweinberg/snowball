import type { NextPage } from 'next';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Button from '~/components/Button';
import Cloud from '~/components/Cloud';
import TextInput from '~/components/form/TextInput';
import Link from '~/components/Link';
import Typography from '~/components/Typography';

const LoginPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-lg p-8 mx-auto mt-20 bg-white shadow-md rounded-2xl">
        <div className="flex justify-between mb-20">
          <Cloud />
          <div className="flex">
            <Typography element="p" variant="Button" className="text-darkgray">
              Need an account?
            </Typography>
            <Link href="/signup">
              <Typography element="div" variant="Link" className="ml-2 underline">
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
              <Typography element="div" variant="Link" className="underline">
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
