
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = 'lugbpdc@dubai.bits-pilani.ac.in';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);

        if (user.email === DEFAULT_ADMIN_EMAIL) {
          // This is the default admin user.
          setIsAdmin(true);
          const userDoc = await getDoc(userDocRef);
          // Ensure their Firestore document is always correct.
          if (!userDoc.exists() || !userDoc.data()?.isAdmin || !userDoc.data()?.isCouncilMember) {
             await setDoc(userDocRef, { 
               name: user.displayName,
               email: user.email,
               isAdmin: true, 
               isCouncilMember: true 
             }, { merge: true });
          }
        } else {
          // For all other users, check their document in Firestore.
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setIsAdmin(!!userDoc.data().isAdmin);
          } else {
             await setDoc(userDocRef, {
              name: user.displayName,
              email: user.email,
              isAdmin: false,
              isCouncilMember: false,
            });
            setIsAdmin(false);
          }
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'hd': 'dubai.bits-pilani.ac.in'
    });
    try {
      await signInWithPopup(auth, provider);
      router.push('/profile');
    } catch (error) {
      console.error("Error during sign-in:", error);
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error during sign-out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
