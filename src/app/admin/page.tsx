
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Users, Calendar, MessageSquare, Shield, Activity, Bug, DollarSign } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventManager } from "@/components/admin/event-manager";
import { UserManager } from "@/components/admin/user-manager";
import { ForumModeration } from "@/components/admin/forum-moderation";
import { CouncilManager } from "@/components/admin/council-manager";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { ReportsManager } from "@/components/admin/reports-manager";
import { SubscriptionManager } from "@/components/admin/subscription-manager";
import { useIsMobile } from "@/hooks/use-mobile";
import { FeatureManager } from "@/components/admin/feature-manager";

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [forumPostCount, setForumPostCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [pendingSubscribers, setPendingSubscribers] = useState(0);


  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);
  
  useEffect(() => {
    if (!isAdmin) return;

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUserCount(snapshot.size);
    });

    const unsubEvents = onSnapshot(collection(db, "events"), (snapshot) => {
      setEventCount(snapshot.size);
    });

    const unsubMessages = onSnapshot(collection(db, "messages"), (snapshot) => {
      setForumPostCount(snapshot.size);
    });
    
    const unsubReports = onSnapshot(collection(db, "reports"), (snapshot) => {
      setReportCount(snapshot.size);
    });
    
    const q = query(collection(db, "users"), where("subscriptionStatus", "==", "pending"));
    const unsubSubscribers = onSnapshot(q, (snapshot) => {
        setPendingSubscribers(snapshot.size);
    });
    
    return () => {
      unsubUsers();
      unsubEvents();
      unsubMessages();
      unsubReports();
      unsubSubscribers();
    }

  }, [isAdmin]);

  if (loading || !isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-1/4 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/10 blur-[100px]"></div>
      </div>
      <div className="container py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Admin Panel</h1>
          <p className="text-lg text-muted-foreground mt-2">Manage users, events, council, and forum content.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8">
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userCount}</div>
              <p className="text-xs text-muted-foreground">Live user count</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Managed</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventCount}</div>
              <p className="text-xs text-muted-foreground">Total events scheduled</p>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forumPostCount}</div>
              <p className="text-xs text-muted-foreground">Total messages in forum</p>
            </CardContent>
          </Card>
           <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Subscriptions</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSubscribers}</div>
              <p className="text-xs text-muted-foreground">Awaiting payment</p>
            </CardContent>
          </Card>
          <Card className="bg-card/60 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bug Reports</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportCount}</div>
              <p className="text-xs text-muted-foreground">Open reports</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="w-full" orientation={isMobile ? "vertical" : "horizontal"}>
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-7 bg-card/60 backdrop-blur-sm h-auto md:h-10">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="council">Council</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="analytics">
            <AdminAnalytics />
          </TabsContent>
           <TabsContent value="subscriptions">
            <SubscriptionManager />
          </TabsContent>
          <TabsContent value="events">
            <EventManager />
          </TabsContent>
          <TabsContent value="users">
            <UserManager />
          </TabsContent>
          <TabsContent value="council">
            <CouncilManager />
          </TabsContent>
          <TabsContent value="forum">
            <ForumModeration />
          </TabsContent>
           <TabsContent value="settings">
            <FeatureManager />
          </TabsContent>
        </Tabs>
        <div className="mt-8">
            <ReportsManager />
        </div>
      </div>
    </div>
  )
}

    