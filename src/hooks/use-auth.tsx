
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = 'lugbpdc@dubai.bits-pilani.ac.in';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setDbUser({ id: userDoc.id, ...userData });
            setIsAdmin(!!userData.isAdmin);
          } else {
            // This is a new user, create their document
            const isDefaultAdmin = authUser.email === DEFAULT_ADMIN_EMAIL;
            const newUser: User = {
                name: authUser.displayName!,
                email: authUser.email!,
                photoURL: authUser.photoURL!,
                isAdmin: isDefaultAdmin,
                isCouncilMember: isDefaultAdmin,
                ...(isDefaultAdmin && {
                    councilDepartment: "Faculty In-Charge",
                    councilRole: "Faculty In-Charge"
                })
            };
            setDoc(userDocRef, newUser, { merge: true }).catch(console.error);
          }
        });
        setUser(authUser);
      } else {
        setUser(null);
        setDbUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'hd': 'dubai.bits-pilani.ac.in'
    });
    await signInWithRedirect(auth, provider);
  };

  const signOutUser = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, isAdmin, signIn, signOutUser }}>
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
