import type { AppProps } from 'next/app';
import WaitForAuth from '~/components/auth/WaitForAuth';
import { AuthProvider } from '~/context/AuthContext';
import '../styles/globals.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <WaitForAuth>
        <Component {...pageProps} />
      </WaitForAuth>
    </AuthProvider>
  );
};
export default MyApp;
