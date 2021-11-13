import { useEffect } from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import FeaturesHome from '~/components/landing/partials/Features';
import FeaturesBlocks from '~/components/landing/partials/FeaturesBlocks';
import Footer from '~/components/landing/partials/Footer';
import Header from '~/components/landing/partials/Header';
import HeroHome from '~/components/landing/partials/HeroHome';
import Newsletter from '~/components/landing/partials/Newsletter';

const Home: React.FunctionComponent = () => {
  useEffect(() => {
    if (document) {
      document.querySelector('html')!.style.scrollBehavior = 'auto';
      window.scroll({ top: 0 });
      document.querySelector('html')!.style.scrollBehavior = '';
    }
  }, []);

  return (
    <RequiredLoggedOut>
      <div className="landing">
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
      </div>
    </RequiredLoggedOut>
  );
};

export default Home;
