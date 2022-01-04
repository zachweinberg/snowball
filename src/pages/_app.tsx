import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WaitForAuth from '~/components/auth/WaitForAuth';
import { AuthProvider } from '~/context/AuthContext';
import { useAnalytics } from '~/hooks/useAnalytics';
import '~/styles/globals.scss';

const HJID = 2659232;
const HSJV = 6;

const MyApp = ({ Component, pageProps }: AppProps) => {
  useAnalytics();

  useEffect(() => {
    hotjar.initialize(HJID, HSJV);
  }, []);

  return (
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
  );
};
export default MyApp;
