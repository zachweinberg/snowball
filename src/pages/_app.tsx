import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import WaitForAuth from '~/components/auth/WaitForAuth';
import { AuthProvider } from '~/context/AuthContext';
import '~/styles/globals.scss';
import '~/styles/landing.scss';

const HJID = 2659232;
const HSJV = 6;

const MyApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    hotjar.initialize(HJID, HSJV);
  }, []);

  return (
    <AuthProvider>
      <WaitForAuth>
        <Component {...pageProps} />
      </WaitForAuth>
    </AuthProvider>
  );
};
export default MyApp;
