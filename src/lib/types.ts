export type CouncilMember = {
  role: string;
  name: string;
  imageUrl: string;
  vacant?: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: Date;
  link?: string;
};

export type ChatMessage = {
  id: string;
  text: string;
  user: string;
  avatarUrl: string;
  timestamp: Date;
  imageUrl?: string;
};
