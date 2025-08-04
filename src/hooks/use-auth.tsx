
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
    const handleAuth = async (authUser: FirebaseUser | null) => {
      if (authUser) {
        setUser(authUser);
        const userDocRef = doc(db, "users", authUser.uid);
        
        const unsubFirestore = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setDbUser({ id: userDoc.id, ...userData });
            setIsAdmin(!!userData.isAdmin);
            setLoading(false);
          } else {
             // This part runs if the user is authenticated but not in Firestore yet
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
            setDoc(userDocRef, newUser, { merge: true }).then(() => {
                setDbUser({ id: authUser.uid, ...newUser });
                setIsAdmin(isDefaultAdmin);
                setLoading(false);
            });
          }
        });

        return () => unsubFirestore();

      } else {
        setUser(null);
        setDbUser(null);
        setIsAdmin(false);
        setLoading(false);
      }
    };
    
    // This handles the redirect result after signing in
    getRedirectResult(auth)
      .then((result) => {
        // If result is null, it means the user is just visiting the page, not returning from a redirect.
        // The onAuthStateChanged listener below will handle their session.
        if (result) {
          // User has successfully signed in. onAuthStateChanged will now fire and handle the user session.
        }
        // Even if the result is null, we need to let onAuthStateChanged do its thing.
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
        setLoading(false); // Stop loading on error
      });

    const unsubscribeAuth = onAuthStateChanged(auth, handleAuth);

    return () => unsubscribeAuth();
  }, []);

  const signIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'hd': 'dubai.bits-pilani.ac.in'
    });
    // We don't need to await this. Firebase handles the redirect.
    signInWithRedirect(auth, provider);
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
