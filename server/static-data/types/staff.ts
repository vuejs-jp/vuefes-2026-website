export type Staff = {
  name: string;
  avatarUrl?: string;
  pinned?: boolean;
  socialUrls?: {
    x?: string;
    github?: string;
  };
};

export type Staffs = {
  leaders: Staff[];
  cores: Staff[];
  volunteers: Staff[];
};
