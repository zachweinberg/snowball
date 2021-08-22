import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';

const RequiredLoggedOut = ({ children }) => {
  const auth = useAuth();
  const { push } = useRouter();

  useEffect(() => {
    if (auth.user) {
      push('/portfolios');
    }
  }, [auth.user]);

  if (auth.user || auth.loading) {
    return null;
  } else {
    return children;
  }
};

export default RequiredLoggedOut;
