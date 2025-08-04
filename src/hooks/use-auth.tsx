
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithRedirect, signOut, getRedirectResult } from 'firebase/auth';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const processAuth = async (authUser: FirebaseUser | null) => {
      if (!authUser) {
        setUser(null);
        setDbUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      setUser(authUser);
      const userDocRef = doc(db, "users", authUser.uid);
      
      // Stop listening for a moment to prevent conflicts
      let unsubDoc: (() => void) | null = null;

      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // This is a new user, create their document in Firestore.
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
        try {
          await setDoc(userDocRef, newUser);
        } catch(e) {
            console.error("Error creating user document:", e);
        }
      } 
      
      // Now, listen for changes to the user document
      unsubDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
              const userData = doc.data() as User;
              setDbUser({ id: doc.id, ...userData });
              setIsAdmin(!!userData.isAdmin);
          }
      });
      
      setLoading(false);

      return () => {
          if (unsubDoc) {
              unsubDoc();
          }
      };
    };

    const unsubscribe = onAuthStateChanged(auth, processAuth);
    
    // Also check for redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          processAuth(result.user);
        }
      })
      .catch((error) => {
        console.error("Error getting redirect result:", error);
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
