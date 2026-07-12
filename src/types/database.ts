export type Project = {
  id: string;
  title: string;
  status: string | null;
  tech: string[];
  description: string | null;
  link: string | null;
  sort_order: number;
  created_at: string;
};

export type BioContent = {
  id: string;
  key: string;
  value: string | null;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type MusicTrack = {
  id: string;
  title: string;
  file_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};
