import type { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import SignUpForm from '~/components/form/SignupForm';

const SignupPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-md mx-auto mt-16">
        <SignUpForm />
        <p className="mt-3 text-sm text-center">
          Already have an account?{' '}
          <Link href="/login">
            <a className="ml-1 font-semibold underline cursor-pointer text-blue1 hover:text-blue2">
              Login
            </a>
          </Link>
        </p>
      </div>
    </RequiredLoggedOut>
  );
};

export default SignupPage;
