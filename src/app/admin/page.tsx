"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Users, Calendar, MessageSquare, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventManager } from "@/components/admin/event-manager";
import { UserManager } from "@/components/admin/user-manager";
import { ForumModeration } from "@/components/admin/forum-moderation";
import { CouncilManager } from "@/components/admin/council-manager";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [forumPostCount, setForumPostCount] = useState(0);


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
    
    return () => {
      unsubUsers();
      unsubEvents();
      unsubMessages();
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
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Admin Panel</h1>
        <p className="text-lg text-muted-foreground mt-2">Manage users, events, council, and forum content.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Live user count</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Events Managed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventCount}</div>
            <p className="text-xs text-muted-foreground">Total events scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forum Posts</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forumPostCount}</div>
            <p className="text-xs text-muted-foreground">Total messages in forum</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="council">Council</TabsTrigger>
          <TabsTrigger value="forum">Forum</TabsTrigger>
        </TabsList>
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
      </Tabs>
    </div>
  )
}
