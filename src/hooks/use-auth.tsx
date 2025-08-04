
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore';
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

const processAuth = async (authUser: FirebaseUser | null) => {
    if (!authUser) {
      return null;
    }
    
    const userDocRef = doc(db, "users", authUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const isDefaultAdmin = authUser.email === DEFAULT_ADMIN_EMAIL;
      const newUser: User = {
 name: authUser.displayName || 'New User',
        email: authUser.email!,
        photoURL: authUser.photoURL!,
        isAdmin: isDefaultAdmin,
        isCouncilMember: isDefaultAdmin,
        ...(isDefaultAdmin && {
          councilDepartment: "Faculty In-Charge",
          councilRole: "Faculty In-Charge"
        })
      };
      try {
        await setDoc(userDocRef, newUser);
      } catch(e) {
          console.error("Error creating user document:", e);
      }
    }
    return authUser;
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const handleRedirectResult = useCallback(async () => {
    try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
            await processAuth(result.user);
            router.push('/profile');
        }
    } catch (error) {
        console.error("Error processing redirect result:", error);
    }
  }, [router]);


  useEffect(() => {
    // This combined effect handles both redirect results and auth state changes,
    // ensuring we don't set loading to false prematurely.
    const initializeAuth = async () => {
        setLoading(true);
        await handleRedirectResult();

        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            if (authUser) {
                setUser(authUser);
                const userDocRef = doc(db, "users", authUser.uid);
                const unsubDoc = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        const userData = doc.data() as User;
                        setDbUser({ id: doc.id, ...userData });
                        setIsAdmin(!!userData.isAdmin);
                    }
                    // Only set loading to false after we have the dbUser info
                    setLoading(false);
                });
                return () => unsubDoc();
            } else {
                setUser(null);
                setDbUser(null);
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    };

    initializeAuth();
  }, [handleRedirectResult]);

  const signIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'hd': 'dubai.bits-pilani.ac.in'
    });

    try {
 await signInWithRedirect(auth, provider);
    } catch (error) {
        console.error("Error during sign-in:", error);
        setLoading(false);
    }
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
