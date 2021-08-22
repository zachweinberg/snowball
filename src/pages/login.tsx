import type { NextPage } from 'next';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';

const LoginPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-md mx-auto mt-16">Login</div>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
