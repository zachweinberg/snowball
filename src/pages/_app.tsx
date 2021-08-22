import type { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import WaitForAuth from '~/components/auth/WaitForAuth';
import { AuthProvider } from '~/context/AuthContext';
import '../styles/globals.css';

// Router.events.on('routeChangeStart', () => NProgress.start());
// Router.events.on('routeChangeComplete', () => NProgress.done());
// Router.events.on('routeChangeError', () => NProgress.done());

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
