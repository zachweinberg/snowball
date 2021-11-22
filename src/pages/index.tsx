import { useEffect } from 'react';
import RequiredLoggedOut from '~/components/auth/RequireLoggedOut';
import Landing from '~/components/landing';

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
      <Landing />
    </RequiredLoggedOut>
  );
};

export default Home;
