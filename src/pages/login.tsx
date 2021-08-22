import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import LoginForm from '~/components/forms/LoginForm';

const LoginPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-md mx-auto mt-16">
        <LoginForm />
        <p className="mt-3 text-sm text-center">
          Don't have an account?{' '}
          <Link href="/signup">
            <a className="ml-1 font-semibold underline cursor-pointer text-blue1 hover:text-blue2">
              Sign up
            </a>
          </Link>
        </p>
      </div>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
