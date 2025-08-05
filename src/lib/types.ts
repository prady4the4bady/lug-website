
import type { Timestamp } from "firebase/firestore";
import type * as z from "zod";
import type { signInSchema, signUpSchema, reportBugSchema } from "./schemas";

export type User = {
    id?: string;
    name: string;
    email: string;
    photoURL: string;
    isAdmin: boolean;
    isCouncilMember: boolean;
    councilRole?: string;
    councilDepartment?: string;
    description?: string;
    createdAt?: Timestamp;
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
  imageUrl?: string;
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

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
export type ReportBugValues = z.infer<typeof reportBugSchema>;
