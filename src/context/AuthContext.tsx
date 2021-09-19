import { CreateUserRequest, User } from '@zachweinberg/wealth-schema';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { API } from '~/lib/api';
import firebase from '~/lib/firebase';

interface AuthContext {
  user: Partial<User> | null;
  loading: boolean;
  signup: (userData: CreateUserRequest) => Promise<void>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

export const authContext = createContext<AuthContext>({
  user: null,
  loading: true,
  signup: async () => {},
  logout: async () => {},
  login: async () => {},
  sendPasswordResetEmail: async () => {},
});

export const AuthProvider = ({ children }) => {
  const auth = useFirebaseAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

const useFirebaseAuth = (): AuthContext => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<Partial<User> | null>(null);
  const router = useRouter();

  const handleUser = (user: firebase.User | null) => {
    if (user) {
      setUser({
        id: user.uid,
        email: user.email!,
      });
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged((user) => {
      handleUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (userData: CreateUserRequest) => {
    const response = await API.createUser(userData);

    if (response.user) {
      await firebase.auth().signInWithEmailAndPassword(userData.email, userData.password);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await API.verifyEmailExists(email);
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      throw e;
    }
  };

  const logout = async () => {
    await firebase.auth().signOut();
    setUser(null);
    router.push('/login');
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
    } catch (e) {
      throw e;
    }
  };

  return { user, loading, signup, logout, login, sendPasswordResetEmail };
};
