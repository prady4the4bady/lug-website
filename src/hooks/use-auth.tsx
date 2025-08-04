
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

        const unsub = onSnapshot(userDocRef, (userDoc) => {
            if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                setDbUser({ id: userDoc.id, ...userData });
                setIsAdmin(!!userData.isAdmin);
            } else {
                // If doc doesn't exist, it means it's a new user. Create the doc.
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
                // No need to call setDbUser here, the onSnapshot will fire again with the new data.
            }
        });
        
        setLoading(false);
        return unsub;
    };
    
    // First, check for redirect result. This should only run once on page load.
    getRedirectResult(auth)
      .then((result) => {
        // If result is not null, it means we just came back from a sign-in redirect.
        // onAuthStateChanged will handle the user session from here.
        // If result is null, it means the user is just visiting the page, not returning from a redirect.
      })
      .catch((error) => {
        console.error("Error processing redirect result:", error);
      })
      .finally(() => {
        // Now, set up the persistent auth state listener.
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            processAuth(authUser).catch(console.error);
        });
        return () => unsubscribe();
      });

  }, []);

  const signIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'hd': 'dubai.bits-pilani.ac.in'
    });
    // We don't need to await this. Firebase handles the redirect.
    await signInWithRedirect(auth, provider);
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
