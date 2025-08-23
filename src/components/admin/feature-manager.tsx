
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import type { FeatureFlags } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { logActivity } from '@/lib/activity-logger';
import { useAuth } from '@/hooks/use-auth';

const defaultFlags: FeatureFlags = {
    showEvents: true,
    showForum: true,
    showSignIn: true,
    showJoinUs: true,
};

export function FeatureManager() {
    const { user } = useAuth();
    const [flags, setFlags] = useState<FeatureFlags | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const settingsDocRef = doc(db, "settings", "featureFlags");
        const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data() as FeatureFlags;
                // Ensure all flags are present, add if missing
                const updatedFlags = { ...defaultFlags, ...data };
                setFlags(updatedFlags);
            } else {
                // If doc doesn't exist, create it with default values
                setDoc(settingsDocRef, defaultFlags);
                setFlags(defaultFlags);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFlagChange = async (flagName: keyof FeatureFlags, value: boolean) => {
        if (!user) return;
        const settingsDocRef = doc(db, "settings", "featureFlags");
        await updateDoc(settingsDocRef, { [flagName]: value });
        await logActivity(user.uid, 'Feature Flag Changed', `Set ${flagName} to ${value}`);
    };

    if (loading || !flags) {
        return (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <Card className="mt-6 bg-card/60 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Feature Visibility</CardTitle>
                <CardDescription>Control which features are visible to non-admin users in the navigation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="events-switch" className="text-base">Events Page</Label>
                        <p className="text-sm text-muted-foreground">Show or hide the "Events" link in the header.</p>
                    </div>
                    <Switch
                        id="events-switch"
                        checked={flags.showEvents}
                        onCheckedChange={(value) => handleFlagChange('showEvents', value)}
                    />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="forum-switch" className="text-base">Forum Page</Label>
                        <p className="text-sm text-muted-foreground">Show or hide the "Forum" link in the header.</p>
                    </div>
                    <Switch
                        id="forum-switch"
                        checked={flags.showForum}
                        onCheckedChange={(value) => handleFlagChange('showForum', value)}
                    />
                </div>
                 <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="joinus-switch" className="text-base">Join Us Page</Label>
                        <p className="text-sm text-muted-foreground">Show or hide the "Join Us" link in the header.</p>
                    </div>
                    <Switch
                        id="joinus-switch"
                        checked={flags.showJoinUs}
                        onCheckedChange={(value) => handleFlagChange('showJoinUs', value)}
                    />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <Label htmlFor="signin-switch" className="text-base">Sign In Button</Label>
                        <p className="text-sm text-muted-foreground">Show or hide the "Sign In" button for guests.</p>
                    </div>
                    <Switch
                        id="signin-switch"
                        checked={flags.showSignIn}
                        onCheckedChange={(value) => handleFlagChange('showSignIn', value)}
                    />
                </div>
            </CardContent>
        </Card>
    );
}

    
