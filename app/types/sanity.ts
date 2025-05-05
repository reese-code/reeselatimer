export interface Project {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  client?: string;
  projectDate?: string;
  technologies?: string[];
  mainImageUrl?: string;
  secondaryImageUrl?: string;
  description?: string;
  websiteUrl?: string;
  tags?: string[];
  buttons?: {
    text: string;
    url?: string;
  }[];
}

export interface Hero {
  title: string;
  contactText: string;
  taglineIconUrl?: string;
  tagline: string;
  subTagline: string;
  projectsLinkText: string;
}
