
import type { Timestamp } from "firebase/firestore";
import type * as z from "zod";
import type { signInSchema, signUpSchema, reportBugSchema } from "./schemas";

export type SubscriptionStatus = 'none' | 'pending' | 'active';
export type SubscriptionTier = 'Annual' | 'Semester';

export type User = {
    id?: string;
    name: string;
    email: string;
    photoURL?: string;
    isAdmin: boolean;
    isCouncilMember: boolean;
    councilRole?: string | null;
    councilDepartment?: string | null;
    description?: string;
    createdAt?: Timestamp;
    subscriptionStatus?: SubscriptionStatus;
    subscriptionTier?: SubscriptionTier | null;
}

export type CouncilMember = User & {
  councilRole: string;
  councilDepartment: string;
};

export type Event = {
  id: string;
  title: string;
  description:string;
  date: Timestamp;
  link?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  user: string;
  avatarUrl: string;
  timestamp: Timestamp | null; // Can be null when server timestamp is pending
  clientTimestamp?: Timestamp; // For immediate display
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
};

export type Report = {
    id: string;
    summary: string;
    description: string;
    userId: string;
    userEmail: string;
    userName: string;
    createdAt: Timestamp;
    category: 'UI/UX' | 'Backend' | 'Feature Request' | 'Other';
    status: 'New' | 'In Progress' | 'Resolved';
}

export type UserActivity = {
    userId: string;
    action: string;
    details: string;
    timestamp: Timestamp;
};

export type Member = {
    userId: string;
    name: string;
    email: string;
    tier: SubscriptionTier;
    joinedAt: Timestamp;
    memberUntil: Timestamp;
};


export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ReportBugValues = z.infer<typeof reportBugSchema>;
