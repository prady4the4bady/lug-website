
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, setDoc, onSnapshot, getDoc, serverTimestamp } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useToast } from './use-toast';
import type { SignInValues, SignUpValues } from '@/lib/types';

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (values: SignUpValues) => Promise<void>;
  signInWithEmail: (values: SignInValues) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ADMIN_EMAIL = 'lugbpdc@dubai.bits-pilani.ac.in';

const BITS_DOMAIN = 'dubai.bits-pilani.ac.in';

const processAuth = async (authUser: FirebaseUser, name?: string) => {
    if (!authUser) return;

    const userDocRef = doc(db, "users", authUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        const isDefaultAdmin = authUser.email === DEFAULT_ADMIN_EMAIL;
        const displayName = name || authUser.displayName || 'New User';
        const newUser: User = {
            name: displayName,
            email: authUser.email!,
            photoURL: authUser.photoURL || `https://placehold.co/128x128.png?text=${displayName.charAt(0)}`,
            isAdmin: isDefaultAdmin,
            isCouncilMember: isDefaultAdmin,
            createdAt: serverTimestamp() as any,
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
};


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
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
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      'hd': BITS_DOMAIN
    });

    try {
      const result = await signInWithPopup(auth, provider);
      await processAuth(result.user);
      router.push('/profile');
    } catch (error: any) {
        if (error.code === 'auth/popup-blocked') {
            toast({
              title: "Pop-up Blocked",
              description: "Your browser blocked the sign-in pop-up. Please allow pop-ups for this site and try again.",
              variant: "destructive"
            });
        } else {
            console.error("Error during sign-in:", error);
            toast({
              title: "Sign-in Failed",
              description: "There was a problem signing you in with Google. Please try again.",
              variant: "destructive"
            });
        }
    } finally {
        setLoading(false);
    }
  };
  
  const signUpWithEmail = async ({ name, email, password }: SignUpValues) => {
    if (!email.endsWith(`@${BITS_DOMAIN}`)) {
        toast({
            title: "Invalid Email",
            description: `You must use a @${BITS_DOMAIN} email address to sign up.`,
            variant: "destructive"
        });
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      await processAuth(userCredential.user, name);
      router.push('/profile');
    } catch (error: any) {
       toast({
        title: "Sign-up Failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async ({ email, password }: SignInValues) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/profile');
    } catch (error: any) {
      toast({
        title: "Sign-in Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  const signOutUser = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, dbUser, loading, isAdmin, signInWithGoogle, signUpWithEmail, signInWithEmail, signOutUser }}>
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
