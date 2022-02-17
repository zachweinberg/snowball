import { useAuth } from '~/hooks/useAuth';
import Spinner from '../ui/Spinner';

const WaitForAuth = ({ children }) => {
  const auth = useAuth();

  if (auth.loading) {
    return (
      <div className="flex items-center justify-center mt-36">
        <Spinner />
      </div>
    );
  } else {
    return children;
  }
};

export default WaitForAuth;
