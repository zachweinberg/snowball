import { CreateUserRequest } from '@wealth/schema';
import { createContext, useEffect, useState } from 'react';
import { API } from '~/lib/api';
import firebase from '~/lib/firebase';

interface AuthContext {
  user: firebase.User | null;
  loading: boolean;
  signup: (userData: CreateUserRequest) => Promise<void>;
}

export const authContext = createContext<AuthContext>({
  user: null,
  loading: true,
  signup: async () => {},
});

export const AuthProvider = ({ children }) => {
  const auth = useFirebaseAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useFirebaseAuth = (): AuthContext => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged((user) => {
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (userData: CreateUserRequest) => {
    const response = await API.createUser(userData);
    if (response.user) {
      await firebase.auth().signInWithEmailAndPassword(userData.email, userData.password);
      console.log('In!');
    }
  };

  return { user, loading, signup };
};
