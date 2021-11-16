import { useRouter } from 'next/router';
import { useEffect } from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';

const Home: React.FunctionComponent = () => {
  const router = useRouter();

  useEffect(() => {
    if (document) {
      document.querySelector('html')!.style.scrollBehavior = 'auto';
      window.scroll({ top: 0 });
      document.querySelector('html')!.style.scrollBehavior = '';
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      router.push('/login');
    }, 3200);
  }, []);
  return (
    <RequiredLoggedOut>
      {/* <div className="landing">
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-grow">
            <HeroHome />
            <FeaturesHome />
            <FeaturesBlocks />
            <Newsletter />
          </main>

          <Footer />
        </div>
      </div> */}
      <div className="mx-auto h-screen flex flex-col items-center justify-center">
        <img src="/img/logo.png" className="w-32 mb-4" />
        <p className="text-center text-sm">
          This is a staging build.
          <br />
          Redirecting to login in 3 seconds...
        </p>
      </div>
    </RequiredLoggedOut>
  );
};

export default Home;
