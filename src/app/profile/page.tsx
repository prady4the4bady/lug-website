
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="relative w-full overflow-hidden">
             <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                <div className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]"></div>
            </div>
            <div className="container py-12 md:py-20">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-headline font-bold">My Dashboard</h1>
                    <p className="text-lg text-muted-foreground mt-2">Manage your profile, events, and certificates.</p>
                </div>
                <ProfileTabs />
            </div>
        </div>
    );
}
