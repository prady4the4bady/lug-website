
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
    const processAuth = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has just signed in via redirect. The onAuthStateChanged will handle the rest.
        }
      } catch (error) {
        console.error("Error processing redirect result:", error);
      }
    };

    processAuth();
    
    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
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
    });

    return () => unsubscribeAuth();
  }, []);

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
