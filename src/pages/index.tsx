import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from '~/components/ui/Spinner';
import { useAuth } from '~/hooks/useAuth';

const Home: NextPage = () => {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      router.push('/portfolios');
    } else {
      router.push('/login');
    }
  });

  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Spinner size={40} />
    </div>
  );
};

export default Home;
