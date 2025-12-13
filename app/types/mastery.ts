// app/types/mastery.ts

export type MasteredTopic = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  totalSeconds: number;
  reachedAt: string | null;
};

export type ProgressTopic = {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  totalSeconds: number;
};
