import type { AppProps } from 'next/app';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { SkeletonTheme } from 'react-loading-skeleton';
import WaitForAuth from '~/components/auth/WaitForAuth';
import { AuthProvider } from '~/context/AuthContext';
import '../styles/globals.css';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <SkeletonTheme color="#e0e0e0" highlightColor="#d2d2d2">
      <AuthProvider>
        <WaitForAuth>
          <Component {...pageProps} />
        </WaitForAuth>
      </AuthProvider>
    </SkeletonTheme>
  );
};
export default MyApp;
