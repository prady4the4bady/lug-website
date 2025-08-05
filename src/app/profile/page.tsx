
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { Button } from "@/components/ui/button";
import { Bug } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">My Dashboard</h1>
                <p className="text-lg text-muted-foreground mt-2">Manage your profile, events, and certificates.</p>
            </div>
            <ProfileTabs />

            <div className="fixed bottom-4 left-4">
                <Button
                    asChild
                    className="group bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 ease-in-out hover:w-40 w-12 h-12 rounded-full flex items-center justify-center"
                    aria-label="Report a bug"
                >
                    <Link href="/report-a-bug">
                        <Bug className="h-5 w-5 shrink-0 transition-transform duration-300 ease-in-out group-hover:-translate-x-5" />
                        <span className="whitespace-nowrap absolute opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-4 duration-300 ease-in-out">
                            Report a Bug
                        </span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}
