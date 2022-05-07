import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WaitForAuth from '~/components/auth/WaitForAuth';
import { AuthProvider } from '~/context/AuthContext';
import { useAnalytics } from '~/hooks/useAnalytics';
import '~/styles/globals.scss';

const HJID = 2659319;
const HSJV = 6;

const MyApp = ({ Component, pageProps }: AppProps) => {
  useAnalytics();

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      hotjar.initialize(HJID, HSJV);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Obsidian Tracker - watch your net worth grow.</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <AuthProvider>
        <WaitForAuth>
          <ToastContainer
            position="top-center"
            autoClose={7000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme="dark"
          />

          <Component {...pageProps} />
        </WaitForAuth>
      </AuthProvider>
    </>
  );
};
export default MyApp;
