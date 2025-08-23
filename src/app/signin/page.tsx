
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isSigningUp, setIsSigningUp] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            router.push('/profile');
        }
    }, [user, loading, router]);
    
    if(loading) {
        return (
             <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }
    
    if (user) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12">
            <Card className="w-full max-w-md bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">{isSigningUp ? "Create an Account" : "Welcome"}</CardTitle>
                    <CardDescription>
                        Access is restricted to members with a BITS Pilani email.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   {isSigningUp ? <SignUpForm /> : <SignInForm />}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or</span>
                        </div>
                    </div>
                    <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)}>
                        {isSigningUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

