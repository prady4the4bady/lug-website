import { ProfileTabs } from "@/components/profile/profile-tabs";

export default function ProfilePage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">My Dashboard</h1>
                <p className="text-lg text-muted-foreground mt-2">Manage your profile, events, and certificates.</p>
            </div>
            <ProfileTabs />
        </div>
    );
}
