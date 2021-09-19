import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Spinner from '~/components/ui/Spinner';

const Home: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  });

  return (
    <div className="flex items-center justify-center w-full mt-20">
      <Spinner size={40} />
    </div>
  );
};

export default Home;
