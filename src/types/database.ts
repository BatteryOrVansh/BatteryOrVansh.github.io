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
