import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import SignUpForm from '~/components/forms/SignupForm';

const LoginPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-md mx-auto mt-16">
        <SignUpForm />
        <p className="text-sm text-center mt-3">
          Already have an account?{' '}
          <Link href="/login">
            <a className="ml-1 text-blue1 cursor-pointer hover:text-blue2 font-semibold underline">
              Login
            </a>
          </Link>
        </p>
      </div>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
