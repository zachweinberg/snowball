import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';

const RequiredLoggedIn = ({ children }) => {
  const auth = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    if (!auth.user) {
      push('/login');
    }
  }, [auth.user]);

  if (!auth.user) {
    return null;
  } else {
    return children;
  }
};

export default RequiredLoggedIn;
