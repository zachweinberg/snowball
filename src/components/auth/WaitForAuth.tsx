import { useAuth } from '~/hooks/useAuth';

const WaitForAuth = ({ children }) => {
  const auth = useAuth();

  if (auth.loading) {
    return null;
  } else {
    return children;
  }
};

export default WaitForAuth;
