
"use client"

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function GoogleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" strokeWidth="1" />
            <path d="M21.0799 10.42H12.5599V13.58H17.8599C17.6399 15.11 16.5199 17.06 12.5599 17.06C9.2399 17.06 6.5199 14.34 6.5199 11C6.5199 7.66 9.2399 4.94 12.5599 4.94C14.0799 4.94 15.1999 5.54 15.7599 6.07L18.1599 3.67C16.5699 2.22 14.6799 1.49 12.5599 1.49C7.9199 1.49 4.1599 5.25 4.1599 9.89C4.1599 14.53 7.9199 18.29 12.5599 18.29C17.2799 18.29 20.8399 14.99 20.8399 10.32C20.8399 10.01 21.0799 10.42 21.0799 10.42Z" fill="currentColor" stroke="none"/>
        </svg>
    )
}

export function SignInForm() {
    const { signInWithGoogle, loading } = useAuth();
    
    return (
        <div className="space-y-4 py-4">
             <Button variant="outline" className="w-full" onClick={signInWithGoogle} disabled={loading}>
                 {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                 Sign in with Google
            </Button>
        </div>
    )
}
