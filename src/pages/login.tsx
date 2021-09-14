import type { NextPage } from 'next';
import React from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Typography from '~/components/Typography';

const LoginPage: NextPage = () => {
  return (
    <RequiredLoggedOut>
      <div className="max-w-2xl p-16 mx-auto bg-white rounded-lg mt-44">
        <div></div>
        <Typography element="h1" variant="Headline1">
          Check out how your net worth has changed.
        </Typography>
      </div>
    </RequiredLoggedOut>
  );
};

export default LoginPage;
