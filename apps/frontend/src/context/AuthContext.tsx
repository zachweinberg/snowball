import { CreateUserRequest, User } from 'schema';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { API, normalizeTimestamps } from '~/lib/api';
import firebase from '~/lib/firebase';

interface AuthContext {
  user: Partial<User> | null;
  loading: boolean;
  signup: (userData: CreateUserRequest) => Promise<void>;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
}

export const authContext = createContext<AuthContext>({
  user: null,
  loading: true,
  signup: async () => {},
  logout: () => {},
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

  useEffect(() => {
    const unsubscribe = firebase.auth().onIdTokenChanged((user) => {
      if (user) {
        API.getMe().then((userData) => {
          setUser(userData.me);
          setLoading(false);
        });
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(user.id)
      .onSnapshot((doc) => {
        setUser(normalizeTimestamps(doc.data() as User));
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
      await API.checkEmailExists(email);
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
